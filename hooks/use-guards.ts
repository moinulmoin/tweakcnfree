import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/hooks/use-toast";
import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";
import { PostLoginActionType } from "./use-post-login-action";
import { useSubscription } from "./use-subscription";

export function useGuards() {
  const { checkValidSession } = useSessionGuard();
  const { checkValidSubscription } = useSubscriptionGuard();

  return {
    checkValidSession,
    checkValidSubscription,
  };
}

export function useSessionGuard() {
  const { data: session } = authClient.useSession();
  const { openAuthDialog } = useAuthStore();

  const checkValidSession = (
    mode: "signin" | "signup" = "signin",
    postLoginActionType?: PostLoginActionType,
    postLoginActionData?: any
  ) => {
    if (!session) {
      openAuthDialog(mode, postLoginActionType, postLoginActionData);
      return false;
    }

    return true;
  };

  return {
    checkValidSession,
  };
}

export function useSubscriptionGuard() {
  const { subscriptionStatus, isPending } = useSubscription();

  const checkValidSubscription = () => {
    if (isPending) return false;

    if (!subscriptionStatus) return false;

    const { requestsRemaining } = subscriptionStatus;

    if (requestsRemaining <= 0) {
      toast({
        title: "Daily limit reached",
        description:
          `You've used all ${AI_REQUEST_FREE_TIER_LIMIT} free AI requests for today. Come back tomorrow!`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return {
    checkValidSubscription,
  };
}
