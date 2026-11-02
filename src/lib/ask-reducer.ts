export type AskState = {
  status: 'idle' | 'retrieving' | 'answering' | 'done';
  qaId: string | null;
  shown: number;
  total: number;
};

export type AskAction =
  | { type: 'select'; qaId: string; total: number; instant?: boolean }
  | { type: 'retrieved'; qaId: string }
  | { type: 'tick'; qaId: string; chars: number }
  | { type: 'reset' };

export const initialAskState: AskState = { status: 'idle', qaId: null, shown: 0, total: 0 };

/** Máquina de estados de "Pregúntale a mi corpus". Las acciones de otra pregunta (obsoletas) se ignoran. */
export function askReducer(s: AskState, a: AskAction): AskState {
  switch (a.type) {
    case 'select':
      return a.instant
        ? { status: 'done', qaId: a.qaId, shown: a.total, total: a.total }
        : { status: 'retrieving', qaId: a.qaId, shown: 0, total: a.total };
    case 'retrieved':
      if (a.qaId !== s.qaId || s.status !== 'retrieving') return s;
      return { ...s, status: 'answering' };
    case 'tick': {
      if (a.qaId !== s.qaId || s.status !== 'answering') return s;
      const shown = Math.min(s.total, s.shown + a.chars);
      return { ...s, shown, status: shown >= s.total ? 'done' : 'answering' };
    }
    case 'reset':
      return initialAskState;
  }
}
