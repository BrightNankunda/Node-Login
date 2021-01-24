const Note = require('./../models/note');

exports.getAllNotes = async (req, res, next) => {

    const notes = await Note.find({createdBy: req.user.id})
        res.json(notes).status(200);
}

exports.postNote = async (req, res, next) => {
    const newNote = new Note(req.body);
    newNote.createdBy = req.user.id;
    try {
        const note = await newNote.save();
        res.json(note).status(201);
    } catch(error) {
        error.status = 400;
        next(error)
    }
}

exports.getNoteById = async (req, res, next) => {
    const {noteId} = req.params;
    try {
        const note = await Note.findById(noteId);
        if(note) {

            res.status(200).json(note);
        } else {
            res.json('NOT FOUND').status(200)
        }
    } catch(err) {
        err.status = 400;
        next(err)
    }
}

exports.updateNote = async (req, res, next) => {
    const {noteId} = req.params;
    try {
        await Note.findByIdAndUpdate(noteId, req.body);
        res.status(200).json({Message: 'Success'});
    } catch(error) {
        error.status = 400;
        next(error);
    }
}

exports.deleteNote = async (req, res, next) => {
    const {noteId} = req.params;
    try {
        await Note.findByIdAndRemove(noteId);
        res.status(200).json({Message: 'Removed'});
    } catch(error) {
        error.status = 400;
        next(error)
    }
}