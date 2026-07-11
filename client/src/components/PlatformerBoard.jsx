import { Suspense, lazy } from 'react';

const PhaserBoard = lazy(() => import('../game/PhaserBoard'));

export default function PlatformerBoard(props) {
  return (
    <Suspense fallback={<div className="platformer-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 600 }}><span style={{ color: '#fff', fontSize: '18px' }}>Loading game engine...</span></div>}>
      <PhaserBoard {...props} />
    </Suspense>
  );
}
