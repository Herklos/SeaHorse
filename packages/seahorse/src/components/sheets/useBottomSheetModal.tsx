import React, { useRef, useEffect, useCallback } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

/**
 * Internal hook shared by all bottom-sheet modal components.
 * Handles present/dismiss lifecycle and provides a stable renderBackdrop callback.
 */
export function useBottomSheetModal(visible: boolean) {
  const ref = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" />
    ),
    []
  );

  return { ref, renderBackdrop };
}
