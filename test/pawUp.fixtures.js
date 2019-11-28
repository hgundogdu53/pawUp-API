
function makeDogPostArray() {
    return [
        {
            id: 1,
            pet_name: "Muffin",
            email: "hgundogdu53@gmail.com",
            type_of_pet: "White cat",
            birthdate: "2019-01-01",
            hobbies: "White cat that loves playing with small cats. Friendly and lovely.",
            owner: 1
        },

        {
            id: 2,
            pet_name: "Muffin2",
            email: "hgundogdu53@gmail.com",
            type_of_pet: "Cat",
            birthdate: "2019-02-01",
            hobbies: "White cat that loves playing with small cats. Friendly and lovely.",
            owner: 1
        }
    ]
}


function makeMaliciousPost() {
    const maliciousPost = {
        id: 911,
        pet_name: "Muffin <script>alert('xss');</script>",
        email: "hgundogdu53@gmail.com <script>alert('xss')</script>",
        type_of_pet: "White cat <script>alert('xss')</script>",
        birthdate: "2019-03-21",
        owner: 1
    };
    const expectedPost = {
        ...maliciousPost,
        pet_name: "Muffin <script>alert('xss');</script>",
        email: "hgundogdu53@gmail.com <script>alert('xss')</script>",
        birthdate: "German Sheperd <script>alert('xss')</script>",
        owner: 1
    };
    return {
        maliciousPost,
        expectedPost
    };
}

module.exports = {
    makeDogPostArray,
    makeMaliciousPost
}
