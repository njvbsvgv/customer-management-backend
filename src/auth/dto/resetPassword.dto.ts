export class ResetPassStep1Dto {
    email!: string
}

export class ResetPassStep2Dto {
    new_password!: string;
    confirmCode!: string
}