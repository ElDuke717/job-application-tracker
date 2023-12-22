import platform
import uuid
import re

from const.code_execution import MAX_COMMAND_DEBUG_TRIES, MAX_RECUSION_LAYER
from const.function_calls import DEBUG_STEPS_BREAKDOWN
from const.messages import AFFIRMATIVE_ANSWERS, NEGATIVE_ANSWERS
from helpers.exceptions.TokenLimitError import TokenLimitError
from helpers.exceptions.TooDeepRecursionError import TooDeepRecursionError
from logger.logger import logger
from prompts.prompts import ask_user


class Debugger:
    def __init__(self, agent):
        self.agent = agent
        self.recursion_layer = 0

    def debug(self, convo, command=None, user_input=None, issue_description=None, is_root_task=False, ask_before_debug=False):
        """
        Debug a conversation.

        Args:
            convo (AgentConvo): The conversation object.
            command (dict, optional): The command to debug. Default is None.
            user_input (str, optional): User input for debugging. Default is None.
                Should provide `command` or `user_input`.
            issue_description (str, optional): Description of the issue to debug. Default is None.
            ask_before_debug (bool, optional): True if we have to ask user for permission to start debugging.

        Returns:
            bool: True if debugging was successful, False otherwise.
        """
        logger.info('Debugging %s', command)
        self.recursion_layer += 1
        if self.recursion_layer > MAX_RECUSION_LAYER:
            self.recursion_layer = 0
            raise TooDeepRecursionError()

        function_uuid = str(uuid.uuid4())
        convo.save_branch(function_uuid)
        success = False

        for i in range(MAX_COMMAND_DEBUG_TRIES):
            if success:
                break

            if ask_before_debug or i > 0:
                print('yes/no', type='button')
                answer = ask_user(self.agent.project, 'Can I start debugging this issue?', require_some_input=False)
                if answer.lower() in NEGATIVE_ANSWERS:
                    return True
                if answer and answer.lower() not in AFFIRMATIVE_ANSWERS:
                    user_input = answer

            llm_response = convo.send_message('dev_ops/debug.prompt',
                {
                    'command': command['command'] if command is not None else None,
                    'user_input': user_input,
                    'issue_description': issue_description,
                    'os': platform.system(),
                    'context': convo.to_context_prompt()
                },
                DEBUG_STEPS_BREAKDOWN)

            completed_steps = []

            try:
                while True:
                    logger.info('Thoughts: ' + llm_response['thoughts'])
                    logger.info('Reasoning: ' + llm_response['reasoning'])
                    steps = completed_steps + llm_response['steps']

                    # TODO refactor to nicely get the developer agent
                    result = self.agent.project.developer.execute_task(
                        convo,
                        f"Thoughts: {llm_response['thoughts']}\n\nReasoning: {llm_response['reasoning']}",
                        steps,
                        test_command=command,
                        test_after_code_changes=True,
                        continue_development=False,
                        is_root_task=is_root_task,
                        continue_from_step=len(completed_steps)
                    )

                    # in case one step failed or llm wants to see the output to determine the next steps
                    if 'step_index' in result:
                        result['os'] = platform.system()
                        step_index = result['step_index']
                        completed_steps = steps[:step_index+1]
                        result['completed_steps'] = completed_steps
                        result['current_step'] = steps[step_index]
                        result['next_steps'] = steps[step_index + 1:]
                        result['current_step_index'] = step_index

                        # Remove the previous debug plan and build a new one
                        convo.remove_last_x_messages(2)
                        # todo before updating task first check if update is needed
                        llm_response = convo.send_message('development/task/update_task.prompt', result,
                            DEBUG_STEPS_BREAKDOWN)
                    else:
                        success = result['success']
                        if not success:
                            convo.load_branch(function_uuid)
                            if 'cli_response' in result:
                                user_input = result['cli_response']
                                convo.messages[-2]['content'] = re.sub(
                                    r'(?<=The output was:\n\n).*?(?=\n\nThink about this output)',
                                    result['cli_response'],
                                    convo.messages[-2]['content'],
                                    flags=re.DOTALL
                                )
                        break

            except TokenLimitError as e:
                if self.recursion_layer > 0:
                    self.recursion_layer -= 1
                    raise e
                else:
                    if not success:
                        convo.load_branch(function_uuid)
                    continue

            # if not success:
            #     # TODO explain better how should the user approach debugging
            #     # we can copy the entire convo to clipboard so they can paste it in the playground
            #     user_input = convo.agent.project.ask_for_human_intervention(
            #         'It seems like I cannot debug this problem by myself. Can you please help me and try debugging it yourself?' if user_input is None else f'Can you check this again:\n{issue_description}?',
            #         response['data']
            #     )

            #     if user_input == 'continue':
            #         success = True

        self.recursion_layer -= 1
        return success
