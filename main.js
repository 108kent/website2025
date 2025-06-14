// アプリケーションの状態管理
let balance = 100000;
let orders = [];
let orderCounter = 0;

/**
 * 残高表示を更新し、ボタンの有効/無効を制御
 */
function updateBalance() {
    document.getElementById('balance').textContent = balance.toLocaleString();
    
    // ボタンの有効/無効を更新
    const orderButtons = document.querySelectorAll('.order-btn');
    const prices = [10000, 15000, 18000];
    
    orderButtons.forEach((btn, index) => {
        btn.disabled = balance < prices[index];
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
        cancelled: false
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
 * 注文を納品状態にする
 * @param {number} orderId - 注文ID
 */
function deliverOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && !order.delivered && !order.cancelled) {
        order.delivered = true;
        updateOrdersDisplay();
        showDeliveryNotification(order);
    }
}

/**
 * 注文をキャンセルする
 * @param {number} orderId - 注文ID
 */
function cancelOrder(orderId) {
    console.log('cancelOrder called with ID:', orderId);
    const order = orders.find(o => o.id === orderId);
    console.log('Found order:', order);
    
    if (!order) {
        console.log('Order not found');
        return;
    }
    
    if (order.delivered) {
        console.log('Order already delivered');
        return;
    }
    
    if (order.cancelled) {
        console.log('Order already cancelled');
        return;
    }

    const cancellationFee = Math.floor(order.price / 2);
    const refund = order.price - cancellationFee;
    
    console.log('Cancellation fee:', cancellationFee, 'Refund:', refund);
    
    const userConfirmed = confirm(`キャンセル手数料として¥${cancellationFee.toLocaleString()}がかかります。¥${refund.toLocaleString()}が返金されます。\n\nキャンセルしますか？`);
    console.log('User confirmed:', userConfirmed);
    
    if (userConfirmed) {
        console.log('Processing cancellation...');
        order.cancelled = true;
        balance += refund;
        console.log('Order cancelled, new balance:', balance);
        updateBalance();
        updateOrdersDisplay();
        showCancellationNotification(order, refund, cancellationFee);
    } else {
        console.log('User cancelled the cancellation');
    }
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

/**
 * 納品通知を表示
 * @param {Object} order - 注文オブジェクト
 */
function showDeliveryNotification(order) {
    const notification = document.getElementById('delivery-notification');
    const message = document.getElementById('delivery-message');
    
    message.textContent = `電気ケーブル ${order.length}m が納品されました！`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

/**
 * 注文一覧の表示を更新
 */
function updateOrdersDisplay() {
    const container = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="no-orders">まだ発注がありません</div>';
        return;
    }
    
    const sortedOrders = [...orders].sort((a, b) => {
        // キャンセル済み、配送中、納品完了の順でソート
        const getStatusPriority = (order) => {
            if (order.cancelled) return 2;
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
    updateBalance();
    
    // 1秒ごとにタイマーを更新
    setInterval(() => {
        if (orders.some(order => !order.delivered && !order.cancelled)) {
            updateOrdersDisplay();
        }
    }, 1000);
}

// DOMが読み込まれた時に初期化を実行
document.addEventListener('DOMContentLoaded', initializeApp);
