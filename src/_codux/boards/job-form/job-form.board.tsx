import { createBoard } from '@wixc3/react-board';
import JobForm from '../../../components/JobForm';

export default createBoard({
    name: 'JobForm',
    Board: () => <JobForm />,
    isSnippet: true,
});
