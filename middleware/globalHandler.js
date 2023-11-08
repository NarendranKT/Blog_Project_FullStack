const globalErrHandler = (err, req, res, next) => {
    // Status : faied something/ server error
    // message : Actual error-> Invalid credentials
    // stack : which file that the particular error is there.

    const stack = err.stack;
    const message = err.message;
    const status = err.status ? err.status : ' failed ';
    const statusCode = err.statusCode ? err.statusCode : 500;


    res.status(statusCode).json({
        status,message,stack
    })

}

module.exports = globalErrHandler;