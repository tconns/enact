import React from 'react';
import warning from 'warning';

// Safely handles functional and object refs (and ignores invalid refs)
function updateRef (ref, node) {
	if (ref) {
		if (typeof ref === 'function') {
			ref(node);
		} else if (ref.hasOwnProperty('current')) {
			ref.current = node;
		} else {
			// warn for a truthy ref that isn't a function or is an object without `current`
			warning(ref, `Invalid ref "${ref}" passed to useChainRefs.`);
		}
	}
}

function chainRefs (...refs) {
	return (node) => {
		refs.forEach(ref => updateRef(ref, node));
	};
}

function useChainRefs (...refs) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return React.useCallback(chainRefs(...refs), refs);
}

export default useChainRefs;
export {
	useChainRefs,
	chainRefs
};
