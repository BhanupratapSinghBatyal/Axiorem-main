"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Cpu,
  Users,
  Building2,
  User,
  ShieldCheck,
  Tv,
  HelpCircle,
  CheckCircle2,
  Globe,
  Info,
  Loader2,
  AlertTriangle,
  PauseCircle,
  Layers
} from 'lucide-react';

import { useCheckout } from '@/hooks/useCheckout.js';
import { useBillingData } from '@/hooks/useBillingData';
import { useSubscriptionActions } from '@/hooks/useSubscriptionActions';
import Toast from './Toast';
import PlansSkeleton from './PlansSkeleton';
import RedirectingModal from './RedirectingModal';

export default function PricingPlans() {
  const [activePlan, setActivePlan] = useState('teams');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'error'
  });
  const [modal, setModal] = useState({
    show: false,
    targetTier: null
  });
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    executeCheckout,
    isProcessing: isCheckoutProcessing
  } = useCheckout();

  const {
    billingDetails,
    billingQuery
  } = useBillingData();

  const {
    changeTier,
    isChangingTier
  } = useSubscriptionActions();

  const isBillingLoading = billingQuery.isLoading;

  const baseMonthlyIndividual = 99;
  const baseMonthlyTeams = 249;

  /*
   * Billing API response:
   *
   * payload.billing.subscriptionTier
   *
   * Possible relevant values:
   * FREE
   * INDIVIDUAL
   * TEAMS
   */

  const rawTier =
    billingDetails?.subscriptionTier ||
    billingDetails?.tier ||
    billingDetails?.accountInfo?.tier;

  const currentTier =
    !rawTier ||
    rawTier === 'FREE_TIER' ||
    rawTier === 'FREE'
      ? 'FREE'
      : String(rawTier).toUpperCase();

  const isProcessing =
    isCheckoutProcessing || isChangingTier;

  const calculatePrice = (baseMonthlyPrice) => {
    return `$${baseMonthlyPrice}`;
  };

  /*
   * Determines whether the requested plan is an upgrade
   * or downgrade relative to the user's current paid plan.
   *
   * FREE users are intentionally excluded because their
   * buttons should retain the existing CHOOSE behavior.
   */
  const getPlanButtonText = (planName) => {
    const requestedPlan = planName.toUpperCase();

    // FREE users keep the existing behavior.
    if (currentTier === 'FREE') {
      return `CHOOSE ${requestedPlan}`;
    }

    // Current plan.
    if (currentTier === requestedPlan) {
      return 'CURRENT PLAN';
    }

    // Individual -> Teams = Upgrade
    if (
      currentTier === 'INDIVIDUAL' &&
      requestedPlan === 'TEAMS'
    ) {
      return 'UPGRADE TO TEAMS';
    }

    // Teams -> Individual = Downgrade
    if (
      currentTier === 'TEAMS' &&
      requestedPlan === 'INDIVIDUAL'
    ) {
      return 'DOWNGRADE TO INDIVIDUAL';
    }

    // Fallback for any unexpected tier.
    return `CHOOSE ${requestedPlan}`;
  };

  /*
   * Whether the Individual / Teams card represents
   * the user's current plan.
   */
  const isCurrentPlan = (planName) => {
    return (
      currentTier !== 'FREE' &&
      currentTier === planName.toUpperCase()
    );
  };

  const handlePlanSelection = async (tierName) => {
    const requestedTierUpper = tierName.toUpperCase();

    // Never attempt an action for the current plan.
    if (currentTier === requestedTierUpper) {
      setToast({
        show: true,
        message:
          "Your workspace is already on this active plan. Manage your plan via billing settings.",
        type: 'error'
      });

      return;
    }

    /*
     * Individual <-> Teams changes are handled through
     * the existing confirmation modal.
     */
    if (
      (currentTier === 'TEAMS' &&
        requestedTierUpper === 'INDIVIDUAL') ||
      (currentTier === 'INDIVIDUAL' &&
        requestedTierUpper === 'TEAMS')
    ) {
      setModal({
        show: true,
        targetTier: requestedTierUpper
      });

      return;
    }

    /*
     * FREE -> Individual / Teams continues through
     * the existing checkout flow.
     */
    setIsRedirecting(true);

    const result = await executeCheckout({
      tier: requestedTierUpper,
      quantity: 1,
      planType: tierName
    });

    if (result && !result.success) {
      setToast({
        show: true,
        message: result.error,
        type: 'error'
      });
    }

    setIsRedirecting(false);
  };

  const confirmTierMutation = () => {
    if (!modal.targetTier) return;

    changeTier(modal.targetTier, {
      onSuccess: (data) => {
        setToast({
          show: true,
          message:
            data.message || 'Plan updated successfully.',
          type: 'success'
        });

        setModal({
          show: false,
          targetTier: null
        });
      },

      onError: (err) => {
        setToast({
          show: true,
          message:
            err.message ||
            'Failed to update subscription plan.',
          type: 'error'
        });

        setModal({
          show: false,
          targetTier: null
        });
      }
    });
  };

  if (isBillingLoading) {
    return (
      <div className="flex h-screen w-full bg-[#292929] text-white font-sans antialiased overflow-hidden relative">
        <PlansSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#212121] text-white font-sans antialiased py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 min-h-0 pb-6">

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToast({
                show: false,
                message: '',
                type: 'error'
              })
            }
          />
        )}

        {modal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#3A3A3A] border border-slate-600 rounded-sm p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">

              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />

                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Confirm Plan Change
                </h3>
              </div>

              <p className="mt-3 text-xs text-slate-300 leading-normal">
                Are you sure you want to change your workspace plan to{' '}
                <span className="font-bold text-white">
                  {modal.targetTier}
                </span>?

                {modal.targetTier === 'INDIVIDUAL' &&
                  ' Downgrades will take effect on your next billing cycle.'}

                {modal.targetTier === 'TEAMS' &&
                  ' Upgrades take effect immediately.'}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">

                <button
                  disabled={isProcessing}
                  onClick={() =>
                    setModal({
                      show: false,
                      targetTier: null
                    })
                  }
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white border border-slate-500 hover:bg-white/5 transition-colors rounded-sm disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  disabled={isProcessing}
                  onClick={confirmTierMutation}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-slate-200 transition-colors rounded-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}

                  Confirm Change
                </button>

              </div>
            </div>
          </div>
        )}

        {isRedirecting && <RedirectingModal />}

        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-white uppercase">
              Pricing that scales with your workflow
            </h1>

            <p className="text-xs text-slate-300 mt-1">
              Create content, automate tasks, and export course materials with plans designed for any scale.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#3A3A3A] p-0.5 rounded-sm text-[11px]">
              <button
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-sm font-semibold transition-colors bg-[#1b365d] text-white shadow-sm disabled:opacity-50"
              >
                Monthly
              </button>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">

          {/* =========================
              INDIVIDUAL
          ========================== */}

          <div
            onClick={() =>
              !isProcessing &&
              setActivePlan('individual')
            }
            className={`w-full bg-[#3A3A3A] rounded-sm p-5 shadow-md flex flex-col justify-between cursor-pointer transition-all ${
              activePlan === 'individual'
                ? 'bg-slate-700'
                : 'hover:bg-slate-700'
            } ${
              isProcessing
                ? 'opacity-60 cursor-not-allowed'
                : ''
            }`}
          >

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-white" />

                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    Individual
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-white">
                  {calculatePrice(baseMonthlyIndividual)}
                </span>

                <span className="text-[11px] text-slate-300 font-medium">
                  /mo
                </span>
              </div>

              <div className="text-[11px] font-medium text-blue-200 bg-[#1b365d]/50 px-2 py-1 rounded-sm uppercase tracking-wider">
                For Solo Creators
              </div>

              <div className="pt-4 border-t border-slate-600">

                <p className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Included Features:
                </p>

                <div className="space-y-2 text-[11px] text-slate-300">

                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>1,000 Credits</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Cpu className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Access to All AI Workflows</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FileText className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Export to SCORM</span>
                  </div>

                </div>
              </div>
            </div>

            {isCurrentPlan('INDIVIDUAL') ? (

              /*
               * CURRENT PLAN
               *
               * This is intentionally not a button.
               */
              <div className="w-full font-bold text-xs py-2 rounded-sm mt-6 border border-slate-500 bg-slate-600/30 text-slate-300 flex items-center justify-center tracking-wider uppercase">
                Current Plan
              </div>

            ) : (

              <button
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelection('individual');
                }}
                className={`w-full font-bold text-xs py-2 rounded-sm mt-6 border transition-colors flex items-center justify-center gap-2 ${
                  activePlan === 'individual'
                    ? 'bg-white text-black border-transparent'
                    : 'bg-transparent text-white border-white hover:bg-white/10'
                } disabled:cursor-not-allowed`}
              >

                {isProcessing &&
                activePlan === 'individual' ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  getPlanButtonText('INDIVIDUAL')
                )}

              </button>

            )}

          </div>


          {/* =========================
              TEAMS
          ========================== */}

          <div
            onClick={() =>
              !isProcessing &&
              setActivePlan('teams')
            }
            className={`w-full bg-[#3A3A3A] rounded-sm p-5 shadow-md flex flex-col justify-between cursor-pointer transition-all ${
              activePlan === 'teams'
                ? 'bg-slate-700'
                : 'hover:bg-slate-700'
            } ${
              isProcessing
                ? 'opacity-60 cursor-not-allowed'
                : ''
            }`}
          >

            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-white" />

                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    Teams
                  </span>
                </div>

                <span className="bg-[#1b365d] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                  Popular
                </span>

              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-white">
                  {calculatePrice(baseMonthlyTeams)}
                </span>

                <span className="text-[11px] text-slate-300 font-medium">
                  /mo
                </span>
              </div>

              <div className="text-[11px] font-medium text-blue-200 bg-[#1b365d]/50 px-2 py-1 rounded-sm uppercase tracking-wider">
                For Growing Teams
              </div>

              <div className="pt-4 border-t border-slate-600">

                <p className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Included Features:
                </p>

                <div className="space-y-2 text-[11px] text-slate-300">

                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>5,000 Credit pool</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Users className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Up to 8 members per workspace</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Cpu className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Access to All AI Workflows</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <FileText className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Export to SCORM</span>
                  </div>

                </div>
              </div>
            </div>

            {isCurrentPlan('TEAMS') ? (

              /*
               * CURRENT PLAN
               *
               * This is intentionally not a button.
               */
              <div className="w-full font-bold text-xs py-2 rounded-sm mt-6 border border-slate-500 bg-slate-600/30 text-slate-300 flex items-center justify-center tracking-wider uppercase">
                Current Plan
              </div>

            ) : (

              <button
                disabled={isProcessing}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlanSelection('teams');
                }}
                className={`w-full font-bold text-xs py-2 rounded-sm mt-6 border transition-colors flex items-center justify-center gap-2 ${
                  activePlan === 'teams'
                    ? 'bg-white text-black border-transparent'
                    : 'bg-transparent text-white border-white hover:bg-white/10'
                } disabled:cursor-not-allowed`}
              >

                {isProcessing &&
                activePlan === 'teams' ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  getPlanButtonText('TEAMS')
                )}

              </button>

            )}

          </div>


          {/* =========================
              ENTERPRISE
          ========================== */}

          <div
            onClick={() =>
              !isProcessing &&
              setActivePlan('enterprise')
            }
            className={`w-full bg-[#3A3A3A] rounded-sm p-5 shadow-md flex flex-col justify-between cursor-pointer transition-all ${
              activePlan === 'enterprise'
                ? 'bg-slate-700'
                : 'hover:bg-slate-700'
            }`}
          >

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-white" />

                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    Enterprise
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-white">
                  Custom
                </span>

                <span className="text-[11px] text-slate-300 font-medium">
                  /contract
                </span>
              </div>

              <div className="text-[11px] font-medium text-blue-200 bg-[#1b365d]/50 px-2 py-1 rounded-sm uppercase tracking-wider">
                For Large Organizations
              </div>

              <div className="pt-4 border-t border-slate-600">

                <p className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  Included Features:
                </p>

                <div className="space-y-2 text-[11px] text-slate-300">

                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Uncapped Credit Pool</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Users className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Uncapped members for workspaces</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Cpu className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Access to All AI Workflows</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>Custom Single Sign-On (SSO) Integration</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Layers className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span>
                      Dedicated LMS & Course Platform Integration Support
                    </span>
                  </div>

                </div>
              </div>
            </div>

            <a
              href="mailto:sales@axioremapp.com"
              className={`w-full font-bold text-xs py-2 rounded-sm mt-6 border transition-colors block text-center ${
                activePlan === 'enterprise'
                  ? 'bg-white text-black border-transparent'
                  : 'bg-transparent text-white border-white hover:bg-white/10'
              }`}
            >
              CONTACT SALES
            </a>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">

          <div className="bg-[#3A3A3A] rounded-sm p-4 flex items-center justify-between gap-4 shadow-md">

            <div className="flex items-center gap-3 min-w-0">

              <div className="p-2 rounded-sm bg-[#212121] flex-shrink-0">
                <Tv className="h-4 w-4 text-white" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate">
                  See it work live
                </h3>

                <p className="text-[11px] text-slate-300 truncate hidden sm:block mt-0.5">
                  Schedule a walkthrough to see team collaboration in action.
                </p>
              </div>

            </div>

            <a
              href="mailto:support@axioremapp.com"
              className="bg-[#1b365d] hover:bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded-sm border border-transparent transition-colors uppercase tracking-wider flex-shrink-0 inline-block text-center"
            >
              Book a Demo
            </a>

          </div>


          <div className="bg-[#3A3A3A] rounded-sm p-4 flex items-center justify-between gap-4 shadow-md">

            <div className="flex items-center gap-3 min-w-0">

              <div className="p-2 rounded-sm bg-[#212121] flex-shrink-0">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate">
                  Need custom integrations?
                </h3>

                <p className="text-[11px] text-slate-300 truncate hidden sm:block mt-0.5">
                  Talk to our team about custom security, LMS integrations, or enterprise setup.
                </p>
              </div>

            </div>

            <a
              href="mailto:sales@axioremapp.com"
              className="bg-transparent hover:bg-white/10 text-white font-bold text-xs px-3 py-1.5 rounded-sm border border-white transition-colors uppercase tracking-wider flex-shrink-0 inline-block text-center"
            >
              Contact Sales
            </a>

          </div>

        </div>


        <footer className="mt-2 border-t border-slate-600 pt-6 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">

            <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-slate-300">
              <PauseCircle className="h-3.5 w-3.5 text-white flex-shrink-0" />
              <span>Pause or Resume anytime</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-slate-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-white flex-shrink-0" />
              <span>Cancel Anytime</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 text-[11px] text-slate-300">
              <Globe className="h-3.5 w-3.5 text-white flex-shrink-0" />
              <span>
                Compliant with standard multi-regional data governance.
              </span>
            </div>

          </div>

          <div className="bg-[#1b365d]/30 rounded-sm p-3.5 flex items-start gap-2.5 text-[11px] text-blue-100 leading-normal">

            <Info className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />

            <p>
              Applicable taxes are calculated during checkout. Annual subscriptions are billed upfront to receive discounted rates.
            </p>

          </div>

        </footer>

      </div>
    </div>
  );
}