"use strict";

const checkWinner = require('../src/checkwinner.js');

describe('checkwinner', () => {
    let room = {};

    test('checkWinner() should return true', () => {
        room.board = [
            0, 0, 0
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            0, 1, 0,
            1, 1, 1,
            0, 0, 1
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            0, 1, 0,
            null, 0, 1,
            1, 1, 1
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return false', () => {
        room.board = [
            1, 0, 0,
            0, 0, 1,
            1, 1, 0
        ];
        expect(checkWinner(room)).toBe(false);
    });

    test('checkWinner() should return false', () => {
        room.board = [ 1 ];
        expect(checkWinner(room)).toBe(false);
    });

    test('checkWinner() should return false', () => {
        room.board = [];
        expect(checkWinner(room)).toBe(false);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            1, 0, 0,
            1, 0, 1,
            1, 1, 0
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            1, 0, 1,
            0, 0, 1,
            1, 0
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            1, null, 0,
            0, null, 0,
            1, 1, 0
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            0, 1, 0,
            1, 0, 1,
            1, 0, 0
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.board = [
            0, 1, 1,
            0, 1, 0,
            1, 0, null
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return false', () => {
        room.board = [ 
            1, 0, 1,
            0, 0, 1,
            0, 1, 0
        ];
        expect(checkWinner(room)).toBe(false);
    });
});