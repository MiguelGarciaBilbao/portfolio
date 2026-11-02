import { describe, expect, test } from 'vitest';
import { askReducer, initialAskState, type AskState } from '@/lib/ask-reducer';

const select = (s: AskState, qaId: string, total = 10, instant = false) =>
  askReducer(s, { type: 'select', qaId, total, instant });

describe('askReducer', () => {
  test('select from idle → retrieving', () => {
    expect(select(initialAskState, 'cloud')).toEqual({
      status: 'retrieving',
      qaId: 'cloud',
      shown: 0,
      total: 10,
    });
  });

  test('retrieved for current qa → answering; stale qa ignored', () => {
    const s = select(initialAskState, 'cloud');
    expect(askReducer(s, { type: 'retrieved', qaId: 'cloud' }).status).toBe('answering');
    expect(askReducer(s, { type: 'retrieved', qaId: 'angular' })).toBe(s);
  });

  test('tick accumulates up to total then done; never exceeds total', () => {
    let s = askReducer(select(initialAskState, 'cloud', 7), { type: 'retrieved', qaId: 'cloud' });
    s = askReducer(s, { type: 'tick', qaId: 'cloud', chars: 3 });
    expect(s).toMatchObject({ status: 'answering', shown: 3 });
    s = askReducer(s, { type: 'tick', qaId: 'cloud', chars: 3 });
    s = askReducer(s, { type: 'tick', qaId: 'cloud', chars: 3 });
    expect(s).toMatchObject({ status: 'done', shown: 7 });
  });

  test('stale tick is ignored', () => {
    const s = askReducer(select(initialAskState, 'cloud'), { type: 'retrieved', qaId: 'cloud' });
    expect(askReducer(s, { type: 'tick', qaId: 'angular', chars: 3 })).toBe(s);
  });

  test('tick while retrieving is ignored', () => {
    const s = select(initialAskState, 'cloud');
    expect(askReducer(s, { type: 'tick', qaId: 'cloud', chars: 3 })).toBe(s);
  });

  test('selecting another question mid-answer restarts cleanly', () => {
    let s = askReducer(select(initialAskState, 'cloud'), { type: 'retrieved', qaId: 'cloud' });
    s = askReducer(s, { type: 'tick', qaId: 'cloud', chars: 5 });
    s = select(s, 'angular', 20);
    expect(s).toEqual({ status: 'retrieving', qaId: 'angular', shown: 0, total: 20 });
  });

  test('instant select → done with full text', () => {
    expect(select(initialAskState, 'cloud', 12, true)).toEqual({
      status: 'done',
      qaId: 'cloud',
      shown: 12,
      total: 12,
    });
  });

  test('reset → initial', () => {
    expect(askReducer(select(initialAskState, 'cloud'), { type: 'reset' })).toEqual(initialAskState);
  });
});
