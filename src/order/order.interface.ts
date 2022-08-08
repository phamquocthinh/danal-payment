interface UserInterface {
    id: number;
    nickname: string;
    email?: string;
}

interface ItemInterface {
    id: number;
    status: string;
    type: string;
    isGift: boolean;
    name: string;
    productCategory: string | null;
    photoURL: string;
    price: number;
    paymentType: string;
    cancelDate: Date | null;
    completeDate: Date | null;
}

export interface OrderInterface {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    status: string;
    totalValue: number;
    payPoint: number;
    userId: number;
    isPaid: boolean;
    isGift: boolean;
    paymentType: string;
    paymentData: string | null;
    cancelDate: Date | null;
    completeDate: Date | null;
    refundDate: Date | null;
    reason: string | null;
    user: UserInterface;
    purchaseHistoryItems: [ ItemInterface ];
    receiver: UserInterface;
    method: string;
}