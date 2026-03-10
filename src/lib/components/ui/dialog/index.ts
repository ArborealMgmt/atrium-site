import { Dialog as DialogPrimitive } from 'bits-ui';

import Title from '$lib/components/ui/dialog/dialog-title.svelte';
import Footer from '$lib/components/ui/dialog/dialog-footer.svelte';
import Header from '$lib/components/ui/dialog/dialog-header.svelte';
import Description from '$lib/components/ui/dialog/dialog-description.svelte';
import Trigger from '$lib/components/ui/dialog/dialog-trigger.svelte';
import Close from '$lib/components/ui/dialog/dialog-close.svelte';
import { Portal, Overlay } from '$lib/components/ui/dialog/dialog-shared';

const Root = DialogPrimitive.Root;

// Export Content using a re-export that avoids circular dependency
// Content is not imported here to break the cycle with dialog-content.svelte
export { default as Content } from '$lib/components/ui/dialog/dialog-content.svelte';
export { default as DialogContent } from '$lib/components/ui/dialog/dialog-content.svelte';

export {
  Root,
  Title,
  Portal,
  Footer,
  Header,
  Trigger,
  Overlay,
  Description,
  Close,
  //
  Root as Dialog,
  Title as DialogTitle,
  Portal as DialogPortal,
  Footer as DialogFooter,
  Header as DialogHeader,
  Trigger as DialogTrigger,
  Overlay as DialogOverlay,
  Description as DialogDescription,
  Close as DialogClose,
};
