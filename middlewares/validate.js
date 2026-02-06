const validate = (schema) => {
    return (req, res, next) => {
        // Prepare data from all sources for validation
        const dataToValidate = {
            body: req.body,
            query: req.query,
            params: req.params
        };

        // Validate against schema
        const { error } = schema.validate(dataToValidate, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: 'Validation Error',
                details: errors
            });
        }
        next();
    };
};

module.exports = validate;
