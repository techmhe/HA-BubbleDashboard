import { describe, expect, it } from 'vitest';
import { roomAccent, type WindowKind } from '../src/logic/window-state';

const w = (kind: WindowKind) => ({ kind, openMin: 0, remaining: 0 });

describe('room tint (Übersicht, Klima, room sheet)', () => {
  it('is blue only while airing runs with the window open', () => {
    expect(roomAccent(w('airing'), false)).toBe('vent');
    expect(roomAccent(w('recommend'), false)).toBe('');
    expect(roomAccent(w('open'), false)).toBe('');
    expect(roomAccent(w('stuck'), false)).toBe('');
  });

  it('keeps heating visible when airing is only recommended', () => {
    expect(roomAccent(w('recommend'), true)).toBe('heat');
    expect(roomAccent(w('none'), true)).toBe('heat');
  });

  it('marks a window open too long red', () => {
    expect(roomAccent(w('overdue'), true)).toBe('alert');
  });
});
