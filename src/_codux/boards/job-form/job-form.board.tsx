import { createBoard } from '@wixc3/react-board';
import JobForm from '../../../components/JobForm';

export default createBoard({
    name: 'JobForm',
    Board: () => <JobForm  key={null}/>,
    isSnippet: true,
    environmentProps: {
canvasWidth: 776,
windowWidth: 1140,
canvasBackgroundColor: '#b84a4a'
}
});
