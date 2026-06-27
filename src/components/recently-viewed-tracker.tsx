"use client";

import { useEffect } from "react";
import { addToRecentlyViewed } from "@/lib/recently-viewed";

interface Props {
  productId: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export function RecentlyViewedTracker({ productId, name, price, image, slug }: Props) {
  useEffect(() => {
    addToRecentlyViewed({ productId, name, price, image, slug });
  }, [productId, name, price, image, slug]);

  return null;
}
