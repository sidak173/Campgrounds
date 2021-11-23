const basejoi = require('joi');
const sanititzeHtml = require('sanitize-html') 

const extension = (joi) => ( // an extension for handling espacedHTML input which we want to flag as errors so as to prevent cross side scripting attacks
    {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML!'
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) { // input,validation heplers 
                    // validating fn

                    const clean = sanititzeHtml(value,  // fn which sanitizes html <scrpit> alert('sd') </script> returns '' ->nothing
                        {
                            allowedTags: [],
                            allowedAttributes: {}
                        });
                    if (clean !== value) {
                        return helpers.error('string.escapeHTML', { value });
                    }
                    return clean;
                }
            }
        }
    }
)

const joi = basejoi.extend(extension);

module.exports.campgroundschema = joi.object({
    title: joi.string().required().escapeHTML(),
    price: joi.number().required().min(0),
    location: joi.string().required().escapeHTML(),
    // image: joi.string().required(),
    description: joi.string().required().escapeHTML()
})
module.exports.reviewschema = joi.object({
    body: joi.string().required().escapeHTML(),
    rating: joi.number().required().min(1).max(5)
})


