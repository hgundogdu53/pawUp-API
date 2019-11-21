const PostsService = {
    getAllPosts(knex) {
        return knex.select('*').from('posts');
    },
    insertPost(knex, newPost) {
        return knex
            .insert(newPost)
            .into('posts')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getByOwnerId(knex, owner_id) {
        return knex.from('posts').select('*').where('owner', owner_id)
    },
    getById(knex, id) {
        console.log('postservice.getById id:', id);
        return knex.from('posts').select('*').where('id', id).first()
    },
    deletePost(knex, id) {
        return knex.from('posts').where({ id }).delete()
    },
    updatePost(knex, id, newPostFields) {
        return knex.from('posts').where({ id }).update(newPostFields)
    }
}

module.exports = PostsService