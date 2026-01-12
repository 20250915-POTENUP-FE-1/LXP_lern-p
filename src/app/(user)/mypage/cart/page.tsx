import Link from 'next/link';
import styles from '@/app/(user)/mypage/MyPageSections.module.css';
import type { OrderStatus } from '@/domains/user/types/order';
import { formatDate } from '@/shared/util/formatDate';
import { getOrders } from '@/domains/user/services/orderService';
import { MOCK_GET_ORDERS } from '@/mocks/order.mock';

export default async function PurchaseHistoryPage() {
  // TODO: API 정상화 후 제거 또는 MSW로 전환
  const { orders, totalCount } =
    process.env.NODE_ENV === 'development' ? MOCK_GET_ORDERS : await getOrders();

  const isEmpty = orders.length === 0;

  return (
    <section className={styles.order} aria-labelledby="mypage-purchase-title">
      <header className={styles.order__header}>
        <h1 id="mypage-purchase-title" className={styles['profile-section__title']}>
          구매 내역
        </h1>

        {!isEmpty && (
          <p className={styles['order__desc']}>
            총 <strong>{totalCount}</strong>건
          </p>
        )}
      </header>

      {isEmpty ? (
        <>
          <p className={styles['order__empty']}>구매 내역이 없습니다.</p>
          <Link className={styles['order__cta']} href="/">
            강좌 보러 가기
          </Link>
        </>
      ) : (
        <div className={styles['order-list']} aria-label="구매 내역 목록">
          {orders.map((order) => (
            <article key={order.orderId} className={styles['order-card']}>
              <div className={styles['order-card__top']}>
                <div className={styles['order-card__meta']}>
                  <p className={styles['order-card__date']}>{formatDate(order.paidAt)}</p>
                  <p className={styles['order-card__order']}>
                    주문번호 <span>{order.orderId}</span>
                  </p>
                </div>

                <div className={styles['order-card__right']}>
                  <span className={styles['order-card__badge']} data-status={order.status}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <p className={styles['order-card__price']}>
                    {order.totalAmount.toLocaleString()}원
                  </p>
                </div>
              </div>

              <ul className={styles['order-card__items']} aria-label="구매 강좌 목록">
                {order.courses.map((course) => (
                  <li key={`${order.orderId}-${course.courseId}`} className={styles['order-item']}>
                    <div className={styles['order-item__main']}>
                      <p className={styles['order-item__title']}>{course.title}</p>
                    </div>

                    <div className={styles['order-item__price']}>
                      {course.price.toLocaleString()}원
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles['order-card__actions']}>
                <Link className={styles['order-card__link']} href={`/orders/${order.orderId}`}>
                  상세 보기
                </Link>

                {order.courses[0]?.courseId ? (
                  <Link
                    className={styles['order-card__link']}
                    href={`/courses/${order.courses[0].courseId}`}
                  >
                    강좌로 이동
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'COMPLETED':
      return '결제 완료';
    case 'PARTIAL_CANCELED':
      return '부분 취소';
    case 'CANCELED':
      return '결제 취소';
    case 'REFUNDED':
      return '환불 완료';
    default:
      return status;
  }
};
