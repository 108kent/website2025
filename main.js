// アプリケーション状態管理
let balance = 100000;
let orders = [];
let orderCounter = 0;
let pendingCancelOrder = null;
let warehouseCostInterval;

/**
 * 倉庫代計算とタイマー開始
 */
function startWarehouseCostTimer() {
    if (warehouseCostInterval) return; // 既に開始している場合は何もしない
    
    warehouseCostInterval = setInterval(() => {
        let totalCost = 0;
        let hasWarehouseItems = false;
        
        orders.forEach(order => {
            if (order.inWarehouse) {
                const now = new Date();
                const secondsInWarehouse = Math.floor((now - order.warehouseEntryTime) / 1000);
                const costForThisOrder = secondsInWarehouse * 10;
                totalCost += 10; // 毎秒10円
                hasWarehouseItems = true;
                
                // 累積倉庫代を更新
                order.totalWarehouseCost = secondsInWarehouse * 10;
            }
        });
        
        if (hasWarehouseItems) {
            balance -= totalCost;
            if (balance < 0) balance = 0; // 残高がマイナスにならないようにする
            updateBalance();
            updateOrdersDisplay();
        }
        
        // 倉庫に商品がない場合はタイマーを停止
        if (!hasWarehouseItems && warehouseCostInterval) {
            clearInterval(warehouseCostInterval);
            warehouseCostInterval = null;
        }
    }, 1000);
}

/**
 * 残高表示を更新し、ボタンの有効/無効を制御
 */
function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance.toLocaleString();
    }
    
    // ボタンの有効/無効を更新
    const orderButtons = document.querySelectorAll('.order-btn');
    const prices = [10000, 15000, 18000];
    
    orderButtons.forEach((btn, index) => {
        if (prices[index]) {
            btn.disabled = balance < prices[index];
        }
    });
}

/**
 * 商品を発注する
 * @param {number} length - ケーブルの長さ（m）
 * @param {number} price - 価格
 * @param {number} deliveryMinutes - 配送時間（分）
 */
function orderProduct(length, price, deliveryMinutes) {
    if (balance < price) {
        alert('残高が不足しています！');
        return;
    }

    balance -= price;
    orderCounter++;
    
    const orderTime = new Date();
    const deliveryTime = new Date(orderTime.getTime() + deliveryMinutes * 60000);
    
    const order = {
        id: orderCounter,
        length: length,
        price: price,
        orderTime: orderTime,
        deliveryTime: deliveryTime,
        deliveryMinutes: deliveryMinutes,
        delivered: false,
        cancelled: false,
        inWarehouse: false,
        warehouseEntryTime: null,
        totalWarehouseCost: 0,
        removedFromWarehouse: false
    };
    
    orders.push(order);
    updateBalance();
    updateOrdersDisplay();
    
    // 納品タイマーを設定
    setTimeout(() => {
        deliverOrder(order.id);
    }, deliveryMinutes * 60000);
}

/**
 * 注文を納品状態にする（倉庫保管開始）
 * @param {number} orderId - 注文ID
 */
function deliverOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && !order.delivered && !order.cancelled) {
        order.delivered = true;
        order.inWarehouse = true;
        order.warehouseEntryTime = new Date();
        order.totalWarehouseCost = 0;
        
        updateOrdersDisplay();
        showDeliveryNotification(order);
        startWarehouseCostTimer(); // 倉庫代計算開始
    }
}

/**
 * 倉庫から商品を取り出す
 * @param {number} orderId - 注文ID
 */
function removeFromWarehouse(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || !order.inWarehouse || order.removedFromWarehouse) {
        return;
    }
    
    console.log('倉庫から取り出し - 注文ID:', orderId);
    
    order.inWarehouse = false;
    order.removedFromWarehouse = true;
    
    const now = new Date();
    const secondsInWarehouse = Math.floor((now - order.warehouseEntryTime) / 1000);
    order.totalWarehouseCost = secondsInWarehouse * 10;
    
    console.log('倉庫滞在時間:', secondsInWarehouse, '秒');
    console.log('総倉庫代:', order.totalWarehouseCost, '円');
    
    updateOrdersDisplay();
    showWarehouseRemovalNotification(order);
}

/**
 * 納品通知を表示
 * @param {Object} order - 注文オブジェクト
 */
function showDeliveryNotification(order) {
    const notification = document.getElementById('delivery-notification');
    const message = document.getElementById('delivery-message');
    
    if (notification && message) {
        message.textContent = `電気ケーブル ${order.length}m が納品され、倉庫に保管されました！`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

/**
 * 倉庫取り出し通知を表示
 * @param {Object} order - 注文オブジェクト
 */
function showWarehouseRemovalNotification(order) {
    const notification = document.getElementById('delivery-notification');
    const message = document.getElementById('delivery-message');
    
    if (notification && message) {
        notification.style.background = 'linear-gradient(135deg, #9b59b6, #8e44ad)';
        message.innerHTML = `注文 #${order.id} を倉庫から取り出しました<br>総倉庫代: ¥${order.totalWarehouseCost.toLocaleString()}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            // 通知の背景色を元に戻す
            setTimeout(() => {
                notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            }, 500);
        }, 4000);
    }
}

/**
 * キャンセルモーダルを表示
 * @param {Object} order - 注文オブジェクト
 */
function showCancelModal(order) {
    const modal = document.getElementById('cancel-modal');
    const message = document.getElementById('cancel-message');
    
    if (modal && message) {
        const cancellationFee = Math.floor(order.price / 2);
        const refund = order.price - cancellationFee;
        
        message.innerHTML = `
            注文 #${order.id} - 電気ケーブル ${order.length}m をキャンセルしますか？<br><br>
            <strong>キャンセル手数料:</strong> ¥${cancellationFee.toLocaleString()}<br>
            <strong>返金額:</strong> ¥${refund.toLocaleString()}
        `;
        
        pendingCancelOrder = order;
        modal.classList.add('show');
    }
}

/**
 * キャンセルモーダルを非表示
 */
function hideCancelModal() {
    const modal = document.getElementById('cancel-modal');
    if (modal) {
        modal.classList.remove('show');
        pendingCancelOrder = null;
    }
}

/**
 * 注文をキャンセルする
 * @param {number} orderId - 注文ID
 */
function cancelOrder(orderId) {
    console.log('キャンセル要求 - 注文ID:', orderId);
    const order = orders.find(o => o.id === orderId);
    
    if (!order || order.delivered || order.cancelled) {
        console.log('キャンセル不可:', order ? '配送完了またはキャンセル済み' : '注文が見つからない');
        return;
    }

    console.log('モーダルを表示');
    showCancelModal(order);
}

/**
 * キャンセル確定処理
 */
function confirmCancellation() {
    if (!pendingCancelOrder) {
        console.log('キャンセル対象の注文がありません');
        return;
    }

    const order = pendingCancelOrder;
    const cancellationFee = Math.floor(order.price / 2);
    const refund = order.price - cancellationFee;
    
    console.log('キャンセル実行中...');
    console.log('手数料:', cancellationFee, '返金額:', refund);
    
    order.cancelled = true;
    balance += refund;
    
    console.log('新しい残高:', balance);
    
    updateBalance();
    updateOrdersDisplay();
    showCancellationNotification(order, refund, cancellationFee);
    hideCancelModal();
    
    console.log('キャンセル完了');
}

/**
 * キャンセル通知を表示
 * @param {Object} order - 注文オブジェクト
 * @param {number} refund - 返金額
 * @param {number} fee - キャンセル手数料
 */
function showCancellationNotification(order, refund, fee) {
    const notification = document.getElementById('delivery-notification');
    const message = document.getElementById('delivery-message');
    
    if (notification && message) {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        message.innerHTML = `注文 #${order.id} をキャンセルしました<br>返金額: ¥${refund.toLocaleString()} (手数料: ¥${fee.toLocaleString()})`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            // 通知の背景色を元に戻す
            setTimeout(() => {
                notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            }, 500);
        }, 4000);
    }
}

/**
 * 注文一覧の表示を更新
 */
function updateOrdersDisplay() {
    const container = document.getElementById('orders-container');
    
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="no-orders">まだ発注がありません</div>';
        return;
    }
    
    const sortedOrders = [...orders].sort((a, b) => {
        // 配送中、倉庫保管中、取り出し済み、キャンセル済みの順でソート
        const getStatusPriority = (order) => {
            if (order.cancelled) return 3;
            if (order.removedFromWarehouse) return 2;
            if (order.inWarehouse) return 1;
            if (order.delivered) return 1;
            return 0; // 配送中
        };
        return getStatusPriority(a) - getStatusPriority(b) || b.orderTime - a.orderTime;
    });
    
    container.innerHTML = sortedOrders.map(order => {
        const now = new Date();
        const timeRemaining = Math.max(0, order.deliveryTime - now);
        const totalTime = order.deliveryMinutes * 60000;
        const elapsed = totalTime - timeRemaining;
        const progress = Math.min(100, (elapsed / totalTime) * 100);
        
        let statusClass, statusText, timerDisplay, actionButton = '';
        
        if (order.cancelled) {
            statusClass = 'status-cancelled';
            statusText = '❌ キャンセル済';
            timerDisplay = '--:--';
        } else if (order.removedFromWarehouse) {
            statusClass = 'status-delivered';
            statusText = '✅ 取り出し済';
            timerDisplay = '完了';
        } else if (order.inWarehouse) {
            statusClass = 'status-in-warehouse';
            statusText = '📦 倉庫保管中';
            const now = new Date();
            const secondsInWarehouse = Math.floor((now - order.warehouseEntryTime) / 1000);
            const currentCost = secondsInWarehouse * 10;
            timerDisplay = `¥${currentCost.toLocaleString()}`;
            
            // 倉庫から出すボタンを追加
            actionButton = `
                <button class="warehouse-btn" onclick="removeFromWarehouse(${order.id})" type="button">
                    倉庫から出す
                </button>
                <div class="warehouse-cost">
                    毎秒 ¥10 の倉庫代が発生中
                </div>
            `;
        } else if (order.delivered) {
            statusClass = 'status-delivered';
            statusText = '✅ 納品完了';
            timerDisplay = '00:00';
        } else {
            statusClass = 'status-pending';
            statusText = '⏳ 配送中';
            const minutes = Math.floor(timeRemaining / 60000);
            const seconds = Math.floor((timeRemaining % 60000) / 1000);
            timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // キャンセルボタンを追加
            const cancellationFee = Math.floor(order.price / 2);
            actionButton = `
                <button class="cancel-btn" onclick="cancelOrder(${order.id})" type="button">
                    キャンセル
                </button>
                <div class="cancel-info">
                    ※手数料: ¥${cancellationFee.toLocaleString()}
                </div>
            `;
        }
        
        return `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-title">注文 #${order.id} - 電気ケーブル ${order.length}m</div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                </div>
                <div class="timer-display">${timerDisplay}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div style="font-size: 0.9rem; color: #7f8c8d; margin-top: 10px;">
                    発注価格: ¥${order.price.toLocaleString()} | 
                    発注時刻: ${order.orderTime.toLocaleString('ja-JP')}
                    ${order.removedFromWarehouse ? `<br>総倉庫代: ¥${order.totalWarehouseCost.toLocaleString()}` : ''}
                </div>
                ${actionButton}
            </div>
        `;
    }).join('');
}

/**
 * アプリケーション初期化
 */
function initializeApp() {
    console.log('電気ケーブル発注システムを初期化中...');
    
    // 残高表示を初期化
    updateBalance();
    
    // モーダルのイベントリスナーを設定
    const confirmButton = document.getElementById('confirm-cancel');
    const cancelButton = document.getElementById('cancel-cancel');
    const modal = document.getElementById('cancel-modal');
    
    if (confirmButton) {
        confirmButton.addEventListener('click', confirmCancellation);
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', hideCancelModal);
    }
    
    // モーダル背景クリックで閉じる
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideCancelModal();
            }
        });
    }
    
    // 1秒ごとにタイマーを更新
    setInterval(() => {
        if (orders.some(order => !order.delivered && !order.cancelled)) {
            updateOrdersDisplay();
        }
    }, 1000);
    
    console.log('アプリケーション初期化完了');
}

// DOMが読み込まれた時に初期化を実行
document.addEventListener('DOMContentLoaded', initializeApp);

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript エラー:', e.error);
});

// デバッグ用の関数（開発者コンソールで使用可能）
window.debugApp = {
    getOrders: () => orders,
    getBalance: () => balance,
    getWarehouseItems: () => orders.filter(order => order.inWarehouse),
    resetApp: () => {
        orders = [];
        orderCounter = 0;
        balance = 100000;
        if (warehouseCostInterval) {
            clearInterval(warehouseCostInterval);
            warehouseCostInterval = null;
        }
        updateBalance();
        updateOrdersDisplay();
        console.log('アプリケーションをリセットしました');
    },
    addBalance: (amount) => {
        balance += amount;
        updateBalance();
        console.log(`残高に¥${amount.toLocaleString()}を追加しました。新しい残高: ¥${balance.toLocaleString()}`);
    }
};
