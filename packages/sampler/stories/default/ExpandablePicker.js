import ExpandablePicker, {ExpandablePickerBase} from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('ExpandablePicker', ExpandablePicker, ExpandablePickerBase);
ExpandablePicker.displayName = 'ExpandablePicker';

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];

storiesOf('Moonstone', module)
	.add(
		'ExpandablePicker',
		() => (
			<ExpandablePicker
				checkButtonAriaLabel={text('checkButtonAriaLabel', Config, '')}
				disabled={boolean('disabled', Config)}
				decrementAriaLabel={text('decrementAriaLabel', Config, '')}
				incrementAriaLabel={text('incrementAriaLabel', Config, '')}
				joined={boolean('joined', Config)}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				pickerAriaLabel={text('pickerAriaLabel', Config, '')}
				title={text('title', Config, 'Favorite Emoji')}
				width={select('width', ['small', 'medium', 'large'], Config)}
			>
				{emoticons}
			</ExpandablePicker>
		),
		{
			info: {
				text: 'Basic usage of ExpandablePicker'
			}
		}
	);
