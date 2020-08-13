import {forProp, handle, not, stop} from '@enact/core/handle';

import {hasPointerMoved} from '../src/pointer';
import Spotlight from '../src/spotlight';

const isNewPointerPosition = (ev) => hasPointerMoved(ev.clientX, ev.clientY);

class SpotlightContainer {
	// set up context and props so we can use handle binding
	context = {};
	props = {};

	constructor ({containerConfig, navigableFilter, preserveId}) {
		// spotlight id - set either via props or generated by Spotlight
		this.id = null;

		// Preserve the spotlight id across instances when it is set via props and preserveId is set
		this.canPreserveId = preserveId;
		this.preserveId = false;

		// container config - set once when the container is added
		this.config = containerConfig;

		// optional filter function to limit the spottable candidates for this container
		this.filter = navigableFilter;

		// private hash of spotlight DOM attributes
		this.attr = {
			'data-spotlight-container': true
		};

		// Used to indicate that we want to stop propagation on blur events that occur as a
		// result of this component imperatively blurring itself on focus when spotlightDisabled
		this.shouldPreventBlur = false;
	}

	get attributes () {
		return this.attr;
	}

	setProps (props) {
		const {disabled, id, muted, restrict} = props;
		this.props = props;

		if (this.id == null || (id && this.id !== id)) {
			if (this.id) {
				this.releaseContainer(this.id);
			}

			this.id = Spotlight.add({
				...this.config,
				id,
				restrict,
				navigableFilter: this.navigableFilter
			});
			this.preserveId = this.canPreserveId && this.id === id;
		} else {
			Spotlight.set(this.id, {restrict});
		}

		this.attr['data-spotlight-id'] = this.id;
		this.attr['data-spotlight-container-disabled'] = disabled;
		this.attr['data-spotlight-container-muted'] = muted;
	}

	unload () {
		this.releaseContainer();
	}

	releaseContainer () {
		if (this.preserveId) {
			Spotlight.unmount(this.id);
		} else {
			Spotlight.remove(this.id);
		}
	}

	navigableFilter = (elem) => {
		// If the component to which this was applied specified a navigableFilter, run it
		if (typeof this.filter === 'function') {
			if (this.filter(elem) === false) {
				return false;
			}
		}

		return true;
	};

	silentBlur ({target}) {
		this.shouldPreventBlur = true;
		target.blur();
		this.shouldPreventBlur = false;
	}

	onBlurCapture = (ev) => {
		if (this.shouldPreventBlur) {
			stop(ev);

			return false;
		}

		return true;
	};

	onFocusCapture = (ev) => {
		if (this.props.disabled === true) {
			stop(ev);
			this.silentBlur(ev);

			return false;
		}

		return true;
	};

	onPointerEnter = handle(
		isNewPointerPosition,
		() => Spotlight.setActiveContainer(this.id)
	).bindAs(this, 'onPointerEnter');

	onPointerLeave = handle(
		not(forProp('restrict', 'self-only')),
		isNewPointerPosition,
		(ev) => {
			const parentContainer = ev.currentTarget.parentNode.closest('[data-spotlight-container]');
			let activeContainer = Spotlight.getActiveContainer();

			// if this container is wrapped by another and this is the currently active
			// container, move the active container to the parent
			if (parentContainer && activeContainer === this.id) {
				activeContainer = parentContainer.dataset.spotlightId;
				Spotlight.setActiveContainer(activeContainer);
			}
		}
	).bindAs(this, 'onPointerLeave');
}

export default SpotlightContainer;
export {
	SpotlightContainer
};
