export interface Item {
    id: string;
    name: string;
    description: string;
    sellPrice: number;
    buyPrice: number;
    isStoreItem: boolean;
    hpRecovery: number;
    costRecovery: number;
    speedBuff: number;
    attackBuff: number;
    defenseBuff: number;
    critBuff: number;
    dodgeBuff: number;
    dotDamageCure: boolean;
    isConfusedCure: boolean;
}
