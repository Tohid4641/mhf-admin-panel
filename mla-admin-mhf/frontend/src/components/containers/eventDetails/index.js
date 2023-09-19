import React from 'react';
import loadable from '@loadable/component';
import DefaultLoading from '../../elements/defaultLoading/defaultLoading';

export default loadable((props) => import('./eventDetails'), {
    fallback: <DefaultLoading />,
});