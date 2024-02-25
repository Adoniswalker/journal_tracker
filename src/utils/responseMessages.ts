type Dictionary = {
    [key: string]: any;
};
export const sendSuccessRes = (message:string, data: Dictionary | Dictionary[]) => {
    return {
        success: true,
        message:message,
        data: data
    }
}
export const sendErrorRes = (message:string, errors: Dictionary, data:Dictionary) => {
    return {
        success: false,
        message:message,
        errors: errors,
        data:data
    }
}
