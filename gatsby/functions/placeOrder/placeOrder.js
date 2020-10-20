const nodemailer = require('nodemailer');

function generateOrderEmail({order, total}) {
    return `
        <div>
            <h2>Your Recent Order for ${total}</h2>
            <p>Please start walking over, we will have your order ready in the next 20 mins.</p>
            <ul>
                ${order.map(item => (
                    `<li>
                        <img src="${item.thumbnail}" alt="${item.name}" />
                        ${item.size} ${item.name} - ${item.price}
                    </li>`
                )).join('')}
            </ul>
            <p><strong>Your Total is $${total} due at pickup</strong></p>
            <style>
                ul {
                    list-style: none;
                }
            </style>
        </div>
    `;
}

//Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

//Test send an email

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body);

    //Check if they have filled out the honeypot
    if (body.mapleSyrup) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Error 0x110092'})
        }
    }

    //Validate data
    const requiredFields = ['email', 'name', 'order'];

    for(const field of requiredFields) {
        console.log(`Checking that ${field} is good`);
        if (!body[field]) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: `Oops! You are missing ${field} field`
                })
            }
        }
    }

    //Make sure order has items in it
    if (!body.order.length) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Why would you order nothing?`
            })
        }
    }

    //Send the mail

    //Send success or error message

    //Test send an email
    const info = await transporter.sendMail({
        from: "Slick's Slices <slick@example.com>",
        to: `${body.name} ${body.email}, orders@example.com`,
        subject: "New Order",
        html: generateOrderEmail({
            order: body.order,
            total: body.total
        })
    });

    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Success'})
    }
}