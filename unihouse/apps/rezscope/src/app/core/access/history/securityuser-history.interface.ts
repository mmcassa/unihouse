

export interface SecurityUserHistory {
    user: number,
    timestamp: Date | null,
    logtime: Date,
    details: string,
    secuserid: number,
    positionid: number,
    groupid: number,
    changetype: string
}