'use strict';

require('./lib/test-env.js');
const awsMocks = require('./lib/aws-mock.js');

// NPM MODULES
const expect = require('chai').expect;
const request = require('superagent');

// APP MODULES
const artistMock = require('./lib/artist-mock.js');
// const photoMock = require('./lib/photo-mock.js');
const galleryMock = require('./lib/gallery-mock.js');
const listingMock = require('./lib/listing-mock.js');
const cleanDB = require('./lib/clean-db.js');
const serverControl = require('./lib/server-control.js');

// APP MODULES
const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const examplePhoto = {
  name: 'goose',
  alt: 'good times',
  image: `${__dirname}/data/dog.jpg`,
};

describe('testing photo router', function() {

  //start server before tests
  before(done => serverControl.serverUp(server, done));
  //stop server after tests
  after(done => serverControl.serverDown(server, done));
  //clean database after each test
  afterEach(done => cleanDB(done));

  describe('testing POST routes - /api/artist/:artistID/photo', function() {
    describe('with valid token and data', function() {

      before(done => artistMock.call(this, done));

      it ('should return a photo', done => {
        request.post(`${url}/api/artist/${this.tempArtist._id}/photo`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .field('name', examplePhoto.name)
        .field('alt', examplePhoto.alt)
        .attach('image', examplePhoto.image)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.body, 'TEST BODY');
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(examplePhoto.name);
          expect(res.body.alt).to.equal(examplePhoto.alt);
          expect(res.body.imageURI).to.equal(awsMocks.uploadMock.Location);
          expect(res.body.objectKey).to.equal(awsMocks.uploadMock.Key);
          done();
        });
      }); // end it block
    });

    describe('with no image', function() {
      before(done => artistMock.call(this, done));
      it('should respond with status 400', done => {
        request.post(`${url}/api/artist/${this.tempArtist._id}/photo`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .field('name', examplePhoto.name)
        .field('alt', examplePhoto.alt)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // describe('with an invalid token', function() {
    //   before(done => artistMock.call(this, done));
    //
    //   it('should respond with status 401', done => {
    //     request.post(`${url}/api/artist/${this.tempArtist._id}/photo`)
    //     .set({Authorization:'Bearer bad'})
    //     .field('name', examplePhoto.name)
    //     .field('alt', examplePhoto.alt)
    //     .attach('image', examplePhoto.image)
    //     .end((err, res) => {
    //       console.log(err.message, 'EROOR MESSAGE');
    //       expect(res.status).to.equal(401);
    //       done();
    //     });
    //   });
    // });
  //
  //   describe('with an invalid artistID', function() {
  //     before(done => artistMock.call(this, done));
  //
  //     it('should respond with status 404', done => {
  //       request.post(`${url}/api/artist/${this.tempArtist._id}goose/photo`)
  //       .set({Authorization: `Bearer ${this.tempToken}`})
  //       .field('name', examplePhoto.name)
  //       .field('alt', examplePhoto.alt)
  //       .attach('image', examplePhoto.image)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(404);
  //         done();
  //       });
  //     });
  //   });
  //
  }); //end describe POST routes
  //
  // describe('testing DELETE routes - /api/artist/:artistID/photo/:photoID', function() {
  //   describe('with valid token and data', function() {
  //     before(done => photoMock.call(this, done));
  //     it ('should return a photo', done => {
  //       request.delete(`${url}/api/artist/${this.tempArtist._id}/photo/${this.tempPhoto._id}`)
  //       .set({Authorization: `Bearer: ${this.tempToken}`})
  //       .end((err, res) => {
  //         if (err)
  //           return done(err);
  //         expect(res.status).to.equal(204);
  //         done();
  //       });
  //     });
  //   });
  //
  //
  //   describe('with invalid token', function() {
  //     before(done => photoMock.call(this, done));
  //     it ('should respond with 401 UnauthorizedError', done => {
  //       request.delete(`${url}/api/artist/${this.tempArtist._id}/photo/${this.tempPhoto._id}`)
  //       .set({Authorization: 'Bearer: '})
  //       .end((err, res) => {
  //         expect(res.status).to.equal(401);
  //         done();
  //       });
  //     });
  //   });
  //
  //   describe('no auth header', function(){
  //     before(done => photoMock.call(this, done));
  //     it('should respond with status 400', done => {
  //       request.delete(`${url}/api/artist/${this.tempArtist._id}/photo/${this.tempPhoto._id}`)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         expect(res.text).to.equal('BadRequestError');
  //         done();
  //       });
  //     });
  //   });
  //
  //   describe('with no bearer auth', function(){
  //     before(done => photoMock.call(this, done));
  //     it('should respond with status 400', done => {
  //       request.delete(`${url}/api/artist/${this.tempArtist._id}/photo/${this.tempPhoto._id}`)
  //       .set({Authorization: 'nothing here'})
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         expect(res.text).to.equal('BadRequestError');
  //         done();
  //       });
  //     });
  //   });
  //
  //   describe('with invalid artistID', function() {
  //     before(done => photoMock.call(this, done));
  //     it ('should return not found', done => {
  //       request.delete(`${url}/api/artist/${this.tempArtist._id}bad/photo/${this.tempPhoto._id}`)
  //       .set({Authorization: `Bearer: ${this.tempToken}`})
  //       .end((err, res) => {
  //         expect(res.status).to.equal(404);
  //         done();
  //       });
  //     });
  //   });
  //   describe('with invalid photoID', function() {
  //     before(done => photoMock.call(this, done));
  //     it ('should return not found', done => {
  //       request.delete(`${url}/api/artist/${this.tempArtist._id}/photo/${this.tempPhoto._id}bad`)
  //       .set({Authorization: `Bearer: ${this.tempToken}`})
  //       .end((err, res) => {
  //         expect(res.status).to.equal(404);
  //         done();
  //       });
  //     });
  //   });
  // });
  //
  // describe('/api/gallery/:galleryID/photo', function() {
  //   describe('with valid token and data', function() {
  //
  //     before(done => galleryMock.call(this, done));
  //
  //     it ('should return a photo', done => {
  //       request.post(`${url}/api/gallery/${this.tempGallery._id}/photo`)
  //       .set({Authorization: `Bearer ${this.tempToken}`})
  //       .field('name', examplePhoto.name)
  //       .field('alt', examplePhoto.alt)
  //       .attach('image', examplePhoto.image)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.status).to.equal(200);
  //         expect(res.body.name).to.equal(examplePhoto.name);
  //         expect(res.body.alt).to.equal(examplePhoto.alt);
  //         expect(res.body.imageURI).to.equal(awsMocks.uploadMock.Location);
  //         expect(res.body.key).to.equal(awsMocks.uploadMock.Key);
  //         done();
  //       });
  //     }); // end it block
  //   });
  //
  //   describe('with no image', function() {
  //     before(done => galleryMock.call(this, done));
  //     it('should respond with status 400', done => {
  //       request.post(`${url}/api/gallery/${this.tempGallery._id}/photo`)
  //       .set({Authorization: `Bearer ${this.tempToken}`})
  //       .field('name', examplePhoto.name)
  //       .field('alt', examplePhoto.alt)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         done();
  //       });
  //     });
  //   });
  // }); //end /api/gallery/:galleryID/photo
  //
  // describe('testing DELETE routes - /api/gallery/:galleryID/photo/:photoID', function() {
  //   describe('with valid token and data', function() {
  //     before(done => photoMock.call(this, done));
  //     it ('should return a photo', done => {
  //       request.delete(`${url}/api/gallery/${this.tempGallery._id}/photo/${this.tempPhoto._id}`)
  //       .set({Authorization: `Bearer: ${this.tempToken}`})
  //       .end((err, res) => {
  //         if (err)
  //           return done(err);
  //         expect(res.status).to.equal(204);
  //         done();
  //       });
  //     });
  //   });
  // });
  //
  // describe('/api/listing/:listingID/photo', function() {
  //   describe('with valid token and data', function() {
  //
  //     before(done => listingMock.call(this, done));
  //
  //     it ('should return a photo', done => {
  //       request.post(`${url}/api/listing/${this.tempListing._id}/photo`)
  //       .set({Authorization: `Bearer ${this.tempToken}`})
  //       .field('name', examplePhoto.name)
  //       .field('alt', examplePhoto.alt)
  //       .attach('image', examplePhoto.image)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.status).to.equal(200);
  //         expect(res.body.name).to.equal(examplePhoto.name);
  //         expect(res.body.alt).to.equal(examplePhoto.alt);
  //         expect(res.body.imageURI).to.equal(awsMocks.uploadMock.Location);
  //         expect(res.body.key).to.equal(awsMocks.uploadMock.Key);
  //         done();
  //       });
  //     }); // end it block
  //   });
  //
  //   describe('with no image', function() {
  //     before(done => listingMock.call(this, done));
  //     it('should respond with status 400', done => {
  //       request.post(`${url}/api/listing/${this.tempListing._id}/photo`)
  //       .set({Authorization: `Bearer ${this.tempToken}`})
  //       .field('name', examplePhoto.name)
  //       .field('alt', examplePhoto.alt)
  //       .end((err, res) => {
  //         expect(res.status).to.equal(400);
  //         done();
  //       });
  //     });
  //   });
  //
  //
  // }); //end /api/listing/:listingID/photo


}); //end first describe block

// mocking data
