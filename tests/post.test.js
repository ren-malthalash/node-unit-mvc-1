const sinon = require('sinon');
const PostModel = require('../models/post.model');
const PostController = require('../controllers/post.controller');


describe('Post controller', () => {
    // Setup the responses
    let req = {
        body: {
            author: 'stswenguser',
            title: 'My first test post',
            content: 'Random content'
        },
        params: {
            _id: "507asdghajsdhjgasd"
        }
    };

    let error = new Error({ error: 'Some error message' });

    let res = {};

    let expectedResult;

    
    describe('create', () => {
        var createPostStub;

        beforeEach(() => {
            // before every test case setup first
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            // executed after the test case
            createPostStub.restore();
        });


        it('should return the created post object', () => {
            // Arrange
            expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                date: Date.now()
            };

            createPostStub = sinon.stub(PostModel, 'createPost').yields(null, expectedResult);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));

        });


        // Error Scenario
        it('should return status 500 on server error', () => {
            // Arrange
            createPostStub = sinon.stub(PostModel, 'createPost').yields(error);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('update', () => {
        var updatePostStub;

        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
            expectedResult = req.body;
        });

        afterEach(() => {
            // executed after the test case
            updatePostStub.restore();
        });

        it('should return updated PostController obj', () => {
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, expectedResult);
            PostController.update(req, res);

            sinon.assert.calledWith(PostModel.updatePost, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));
        });

        it('should return 404 for non-existing PostController id', () => {
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, null);
            PostController.update(req, res);

            sinon.assert.calledWith(PostModel.updatePost, req.body);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        });

        it('should return status 500 on server error', () => {
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(error);
            PostController.update(req, res);

            sinon.assert.calledWith(PostModel.updatePost, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('findPost', () => {
        var findPostStub;

        beforeEach(function () {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
            expectedResult = req.body
        });

        afterEach(() => {
            // executed after the test case
            findPostStub.restore();
        });
        
        it('should return post obj', () => {
            findPostStub = sinon.stub(PostModel, 'findPost').yields(null, expectedResult);
            PostController.find(req, res);
            sinon.assert.calledWith(PostModel.findPost, req.params.id);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));
        });
        
        it('should return 404 for non-existing post id', () => {
            findPostStub = sinon.stub(PostModel, 'findPost').yields(null, null);
            PostController.find(req, res);
            sinon.assert.calledWith(PostModel.findPost, req.params.id);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        });

        it('should return status 500 on server error', () => {
            findPostStub = sinon.stub(PostModel, 'findPost').yields(error);
            PostController.find(req, res);
            sinon.assert.calledWith(PostModel.findPost, req.params.id);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });
});