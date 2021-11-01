const response = (isSuccess, message, data) => {
    return {
        success : isSuccess,
        message : message || undefined,
        data : data || undefined
    }
}


module.exports = response;