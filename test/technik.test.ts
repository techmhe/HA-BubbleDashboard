import { describe, expect, it } from 'vitest';
import { isTechUser } from '../src/logic/technik';
import { cfg, techHass } from './fixture-technik';

describe('tech users', () => {
  it('treats listed users as tech users by id or name, case-insensitive', () => {
    expect(isTechUser(techHass({}, 'anna'), cfg({ technik: { users: ['anna'] } }))).toBe(true);
    expect(isTechUser(techHass({}, 'anna'), cfg({ technik: { users: ['u-anna'] } }))).toBe(true);
    expect(isTechUser(techHass({}, 'max'), cfg({ technik: { users: ['u-anna'] } }))).toBe(false);
  });

  it('defaults to admins', () => {
    expect(isTechUser(techHass({}, 'max'), cfg({}))).toBe(true);
    expect(isTechUser(techHass({}, 'anna'), cfg({}))).toBe(false);
    expect(isTechUser(techHass({}, 'max'), cfg({ technik: {} }))).toBe(true);
  });

  it('is off for everyone with technik: false', () => {
    expect(isTechUser(techHass({}, 'max'), cfg({ technik: false }))).toBe(false);
  });

  it('is off without a user', () => {
    const hass = techHass();
    delete hass.user;
    expect(isTechUser(hass, cfg({}))).toBe(false);
  });
});
