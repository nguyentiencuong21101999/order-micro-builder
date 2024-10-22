import { TransformFnParams } from 'class-transformer'

/** Transform 0/1 to true/false */
export const ToBoolean = (param: TransformFnParams) => {
    if (param?.value === 1) {
        return true
    } else if (param.value == 0) {
        return false
    }
    return param.value
}

/** Transform string to number */
export const ToNumber = (param: TransformFnParams) => {
    const number = Number(param.value)
    if (isNaN(number)) {
        return param.value
    }   
    return number
}
