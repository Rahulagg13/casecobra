"use client";
import { Suspense, useEffect } from "react";
import ThankYou from "./ThankYou";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const handlePopState = () => {
      router.push("/configure/upload");
      router.refresh();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
};

export default Page;
