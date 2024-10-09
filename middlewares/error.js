class ErrorHandler extends Error{
    constructor(message, statuscode){
        super(message);
        this.statuscode = statuscode;
    }
}

export const errorMiddleware = (err, req,res, next) => {

    console.log("Error occurred:", err.stack);

    err.statuscode = err.statuscode || 500;
    err.message = err.message || 'Internal server error.';

    if (err.name === "CastError"){
        const message = `invalid ${err.path}`;
        err = new ErrorHandler(message, 400)
    }
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`
        err = new ErrorHandler(message,400)
    }
    if (err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid.`;
        err = new ErrorHandler(message, 400)
    }
    if (err.name === "TokenExpiredError"){
        const message = `Json web Token is expired.`;
        err = new ErrorHandler(message, 400)
    }

    return res.status(err.statuscode).json({
        success: false,
        message: err.message,
    })
}

export default ErrorHandler;