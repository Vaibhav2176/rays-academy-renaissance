import React from 'react';
import { format } from 'date-fns';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudentOrder } from '@/hooks/useStudentEntitlements';

interface StudentOrdersListProps {
  orders: StudentOrder[];
  isLoading?: boolean;
}

export const StudentOrdersList: React.FC<StudentOrdersListProps> = ({
  orders,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-muted/40 animate-pulse border border-border/50"
          />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed rounded-xl bg-card">
        <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <h4 className="text-base font-semibold text-foreground mb-1">
          No Purchases Yet
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Your orders, bundle passes, and unlocked materials will appear here with full transaction receipts.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: StudentOrder['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-600/15 text-green-700 dark:text-green-300 border-green-500/30 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30 text-xs">
            <Clock className="w-3 h-3 mr-1" /> Pending Payment
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-600/15 text-red-700 dark:text-red-300 border-red-500/30 text-xs">
            <XCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline" className="text-muted-foreground text-xs">
            <RotateCcw className="w-3 h-3 mr-1" /> Refunded
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const orderDate = order.paid_at || order.created_at;
        const formattedDate = orderDate
          ? format(new Date(orderDate), 'dd MMM yyyy, hh:mm a')
          : 'Date unavailable';
        const formattedAmount = `₹${(order.total_minor / 100).toFixed(0)}`;
        const shortOrderId = order.id.slice(0, 8);
        const paymentAttempt = order.payment_attempts?.[0];

        return (
          <Card
            key={order.id}
            className="border-border/70 shadow-sm hover:border-border transition-all"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    Order #{shortOrderId}
                  </span>
                  <span className="text-muted-foreground text-xs">·</span>
                  <span className="text-xs text-muted-foreground">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <span className="text-sm font-bold text-foreground">
                    {formattedAmount}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="pt-3 space-y-2">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate">
                          {item.product_title}
                        </span>
                        {item.quantity > 1 && (
                          <Badge variant="secondary" className="text-[10px] py-0 px-1">
                            x{item.quantity}
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground shrink-0 font-medium">
                        ₹{(item.unit_price_minor / 100).toFixed(0)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Study Material Package
                  </div>
                )}

                {paymentAttempt?.provider_order_id && (
                  <div className="pt-1 text-[11px] text-muted-foreground font-mono truncate">
                    Gateway Ref: {paymentAttempt.provider_order_id}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StudentOrdersList;

