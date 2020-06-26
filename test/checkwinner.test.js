"use strict";

const checkWinner = require('../src/checkwinner.js');

describe('checkwinner', () => {
    let room = {};

    test('checkWinner() should return true', () => {
        room.b = [
            "x", "x", "x"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "x", "o", "x",
            "o", "o", "o",
            "x", "x", "o"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "x", "o", "x",
            null, "x", "o",
            "o", "o", "o"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return false', () => {
        room.b = [
            "o", "x", "x",
            "x", "x", "o",
            "o", "o", "x"
        ];
        expect(checkWinner(room)).toBe(false);
    });

    test('checkWinner() should return false', () => {
        room.b = [ "o" ];
        expect(checkWinner(room)).toBe(false);
    });

    test('checkWinner() should return false', () => {
        room.b = [];
        expect(checkWinner(room)).toBe(false);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "o", "x", "x",
            "o", "x", "o",
            "o", "o", "x"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "o", "x", "o",
            "x", "x", "o",
            "o", "x"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "o", null, "x",
            "x", null, "x",
            "o", "o", "x"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "x", "o", "x",
            "o", "x", "o",
            "o", "x", "x"
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return true', () => {
        room.b = [
            "x", "o", "o",
            "x", "o", "x",
            "o", "x", null
        ];
        expect(checkWinner(room)).toBe(true);
    });

    test('checkWinner() should return false', () => {
        room.b = [ 
            "o", "x", "o",
            "x", "x", "o",
            "x", "o", "x"
        ];
        expect(checkWinner(room)).toBe(false);
    });
});