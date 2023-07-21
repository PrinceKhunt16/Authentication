export function checkConfirmPassword(password, confirmPassword) {
    return password === confirmPassword && confirmPassword !== ''
}

export function checkEmail(email) {
    const e = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    return e.test(email)
}

export function checkPassword(password) {
    return password.length >= 8 && password.length <= 20
}

export function checkText(str, min, max) {
    return str.length >= min && str.length <= max
}

export function checkOTP(str) {
    return str.length === 6
}

export function checkImage(file) {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
}