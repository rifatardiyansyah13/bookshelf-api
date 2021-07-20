const { nanoid } = require('nanoid');
const _ = require('lodash');
const books = require('./book');

// Function for addBooks
const addBooks = (request, h) => {
  // Request payload add books
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading = false,
  } = request.payload;

  // Validasi name
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Validasi readPage lebih dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  let finished = false; // default value finished
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (pageCount === readPage) {
    finished = true;
  }

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBooks);

  const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Function for get list all books
const getAllBooks = () => {
  // New books objects for response body
  const showBooks = _.map(books, (e) => _.pick(e, ['id', 'name', 'publisher']));
  return {
    status: 'success',
    data: {
      books: showBooks,
    },
  };
};

module.exports = { addBooks, getAllBooks };
