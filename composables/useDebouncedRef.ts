export function useDebouncedRef<T>(source: Ref<T>, delay: number = 300) {
  const debounced = ref(source.value) as Ref<T>;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  watch(source, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      debounced.value = newValue;
    }, delay);
  })

  onScopeDispose(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  })

  return debounced;
}