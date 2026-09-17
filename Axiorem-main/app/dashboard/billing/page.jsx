'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  ChevronDown,
  Info,
  X,
  Lock,
  CheckCircle2,
  FileDown,
  Edit2,
  AlertTriangle,
  Pause,
  Play,
  ArrowRight
} from 'lucide-react';

import { useBillingData } from '@/hooks/useBillingData';
import { usePaymentMethodMutation } from '@/hooks/usePaymentMethodMutation';
import { useSubscriptionActions } from '@/hooks/useSubscriptionActions';

import Toast from './components/Toast';
import BillingConfirmationModal from './components/BillingConfirmationModal';
import BillingSkeleton from './BillingSkeleton';

const formatCreditAmount = (value) => {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount < 0) return '0';

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(amount);
};

export default function BillingPage() {
  const [showAlert, setShowAlert] = useState(true);
  const [billingEmail, setBillingEmail] = useState('');
  const [toast, setToast] = useState(null);
  const [localPlanType, setLocalPlanType] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const {
    billingDetails,
    credits,
    availableCredits: rawAvailableCredits,
    reservedCredits: rawReservedCredits,
    totalCredits: rawTotalCredits,
    paymentMethod,
    invoices = [],
    customer,
    isLoading,
    isError
  } = useBillingData();

  const availableCredits = credits?.availableCredits ?? credits?.available ?? rawAvailableCredits ?? 0;
  const reservedCredits = credits?.reservedCredits ?? credits?.reserved ?? rawReservedCredits ?? 0;
  const totalCredits = credits?.totalCredits ?? credits?.total ?? rawTotalCredits ?? 0;

  const {
    mutate: updatePaymentMethod,
    isPending: isUpdating
  } = usePaymentMethodMutation();

  const {
    pause,
    isPausing,
    resume,
    isResuming,
    cancel,
    isCancelling
  } = useSubscriptionActions();

  const isProcessingAction =
    isPausing ||
    isResuming ||
    isCancelling ||
    isUpdating;

  const rawTier =
    billingDetails?.subscriptionTier ??
    billingDetails?.tier ??
    'FREE';

  const currentPeriodEnd =
    billingDetails?.currentPeriodEnd ??
    null;

  const amountDue =
    billingDetails?.upcomingInvoice?.amountDue ??
    0;

  const currency =
    billingDetails?.upcomingInvoice?.currency ??
    'USD';

  useEffect(() => {
    if (rawTier) {
      setLocalPlanType(rawTier);
    }
  }, [rawTier]);

  useEffect(() => {
    if (customer?.email) {
      setBillingEmail(customer.email);
    }
  }, [customer?.email]);

  const formatBillingDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return 'N/A';
      }

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-[#292929] text-white font-sans antialiased overflow-hidden relative">
        <BillingSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#212121] text-red-400 text-xs font-bold uppercase tracking-wider">
        Error loading billing data.
      </div>
    );
  }

  const normalizedPlanType = String(localPlanType || rawTier || '').toUpperCase();
  const isFreePlan = normalizedPlanType === 'FREE';

  if (isFreePlan) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#212121] text-white antialiased flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full p-8 rounded-sm text-center space-y-6">
          <div className="mx-auto rounded-full flex items-center justify-center">
            <img
              src="/elements/grid_sub.png"
              alt="Grid Subscription"
              className="h-[50%] text-slate-300"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-wider text-white uppercase">
              No Active Subscription
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently using the Free tier. Purchase a plan to enable billing management, track invoices, access high-capacity limits, and manage your subscription options.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/plans"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#2a4a7a] transition shadow-md border border-transparent"
            >
              <span>Explore Plans & Upgrade</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentlyPaused = normalizedPlanType === 'PAUSE_PENDING_FREE';

  const triggerActionModal = (type) => {
    setModalType(type);
    setIsConfirmOpen(true);
  };

  const handleExecuteConfirmedAction = () => {
    setIsConfirmOpen(false);

    if (modalType === 'PAUSE') {
      pause(undefined, {
        onSuccess: () => {
          setLocalPlanType('PAUSE_PENDING_FREE');
          setToast({
            message: 'Subscription successfully paused.',
            type: 'success'
          });
        },
        onError: (error) => {
          setToast({
            message: error?.message || 'Failed to pause subscription.',
            type: 'error'
          });
        }
      });
      return;
    }

    if (modalType === 'RESUME') {
      resume(undefined, {
        onSuccess: () => {
          setLocalPlanType('MONTHLY');
          setToast({
            message: 'Subscription successfully resumed.',
            type: 'success'
          });
        },
        onError: (error) => {
          setToast({
            message: error?.message || 'Failed to resume subscription.',
            type: 'error'
          });
        }
      });
      return;
    }

    if (modalType === 'CANCEL') {
      cancel(undefined, {
        onSuccess: () => {
          setLocalPlanType('FREE');
          setToast({
            message: 'Subscription cancellation request transmitted successfully.',
            type: 'success'
          });
        },
        onError: (error) => {
          setToast({
            message: error?.message || 'Failed to cancel subscription.',
            type: 'error'
          });
        }
      });
      return;
    }

    if (modalType === 'UPDATE_PAYMENT') {
      updatePaymentMethod(undefined, {
        onSuccess: () => {
          setToast({
            message: 'Payment structure update routine processed.',
            type: 'success'
          });
        },
        onError: (error) => {
          setToast({
            message: error?.message || 'Gateway handshake failed.',
            type: 'error'
          });
        }
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#212121] text-white antialiased">
      <div className="w-full space-y-6">

        <header className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
            Billing
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Manage your billing information, view payment history, and update your subscription details.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Plan overview
          </h2>

          <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-slate-600 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Current Plan
                </span>

                <div className="text-sm font-bold text-white uppercase tracking-wide">
                  {rawTier || 'Paid'} Plan
                </div>

                <div className="text-xs text-slate-300">
                  {formatCreditAmount(availableCredits)} credits remaining, shared workspace pool
                </div>
              </div>

              <Link
                href="/dashboard/plans"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#2a4a7a] transition shadow-sm border border-transparent"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Change Plan
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#3A3A3A]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Available Credits
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {formatCreditAmount(availableCredits)}
                </span>
              </div>

              {/* <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Reserved Credits
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {formatCreditAmount(reservedCredits)}
                </span>
              </div> */}

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Total Credits
                </span>
                <span className="text-sm font-bold text-white tracking-wide">
                  {formatCreditAmount(totalCredits)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#3A3A3A] border-t border-slate-600">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Renewal Payment
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  {formatBillingDate(
                    currentPeriodEnd ||
                    billingDetails?.upcomingInvoice?.nextBillingDate
                  )}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Amount
                </span>
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  {currency || 'USD'} ${amountDue || 0}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#252525] border-t border-slate-600 gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Subscription Actions
                </span>
                <p className="text-xs text-slate-400">
                  Cancel or pause your subscription. You will retain database features and access until the current period terminates.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {isCurrentlyPaused ? (
                  <button
                    onClick={() => triggerActionModal('RESUME')}
                    disabled={isProcessingAction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#2a4a7a] transition shadow-sm disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    Resume Subscription
                  </button>
                ) : (
                  <button
                    onClick={() => triggerActionModal('PAUSE')}
                    disabled={isProcessingAction}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#3A3A3A] hover:bg-slate-600 transition shadow-sm disabled:opacity-50"
                  >
                    <Pause className="w-3 h-3" />
                    Pause Subscription
                  </button>
                )}

                <button
                  onClick={() => triggerActionModal('CANCEL')}
                  disabled={isProcessingAction}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-slate-700 hover:bg-slate-600 transition shadow-sm disabled:opacity-50"
                >
                  <AlertTriangle className="w-3 h-3" />
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          {showAlert && (
            <div className="flex items-center justify-between bg-[#1b365d] text-white px-4 py-3.5 rounded-sm text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-white shrink-0" />
                <p className="font-medium tracking-wide uppercase">
                  Need more credits or advanced features? Upgrade to our Enterprise plan.
                  <a
                    href="mailto:sales@axioremapp.com"
                    className="underline font-bold hover:text-slate-200 transition ml-1"
                  >
                    Contact Sales
                  </a>
                </p>
              </div>

              <button
                onClick={() => setShowAlert(false)}
                className="text-white/70 hover:text-white transition p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Payment method
            </h2>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-medium">
              <span>
                All transactions are secure and encrypted by{' '}
                <span className="font-bold text-white">Dodo Payments</span>
              </span>
              <Lock className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-slate-600 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 w-24 block shrink-0">
                  Card Details
                </span>

                <div className="flex items-center gap-3 flex-wrap">
                  {paymentMethod?.cardBrand !== 'UPI' ? (
                    <>
                      <div className="flex items-center justify-center w-10 h-6 bg-slate-700 rounded-sm font-bold text-[10px] text-white select-none border border-slate-600">
                        {paymentMethod?.cardBrand || 'MC'}
                      </div>
                      <span className="text-xs font-bold text-white tracking-widest">
                        •••• •••• •••• {paymentMethod?.last4 || '0000'}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Expires {paymentMethod?.expiry || '1/28'}
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-10 h-6 bg-slate-700 rounded-sm font-bold text-[10px] text-white select-none border border-slate-600">
                      UPI
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => triggerActionModal('UPDATE_PAYMENT')}
                disabled={isProcessingAction}
                className="flex items-center justify-center px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#1b365d] hover:bg-[#2a4a7a] transition shadow-sm whitespace-nowrap w-full sm:w-auto border border-transparent disabled:opacity-50"
              >
                Edit Payment Method
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 w-24 block shrink-0 mt-2 sm:mt-0">
                  Billing Email
                </span>

                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs font-medium tracking-wider text-white bg-[#212121] border border-slate-600 focus:outline-none focus:ring-1 focus:ring-[#1b365d] transition shadow-inner"
                  placeholder="billing@company.com"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Billing history
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#3A3A3A] hover:bg-slate-600 transition shadow-sm">
                <Download className="w-3.5 h-3.5 text-white" />
                Download
              </button>

              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider text-white bg-[#3A3A3A] hover:bg-slate-600 transition shadow-sm">
                All Time
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          <div className="bg-[#3A3A3A] rounded-sm shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-600 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-700/40">
                    <th className="p-4 w-12 text-white font-bold">S No.</th>
                    <th className="p-4 text-white font-bold">Invoice ID</th>
                    <th className="p-4 text-white font-bold">Plan</th>
                    <th className="p-4 text-white font-bold">Amount</th>
                    <th className="p-4 text-white font-bold">Date</th>
                    <th className="p-4 text-white font-bold">Status</th>
                    <th className="p-4 w-12 text-center" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-600 text-xs text-white">
                  {invoices.map((invoice, index) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-600 transition-colors"
                    >
                      <td className="p-4 font-semibold uppercase tracking-wider text-white">
                        {index + 1}
                      </td>
                      <td className="p-4 font-semibold uppercase tracking-wider text-white">
                        #{invoice.id}
                      </td>
                      <td className="p-4 text-slate-300 uppercase tracking-wider font-medium">
                        {invoice.plan}
                      </td>
                      <td className="p-4 font-bold text-white uppercase tracking-wider">
                        {invoice.currency || 'USD'} {invoice.amount}
                      </td>
                      <td className="p-4 text-slate-300 uppercase tracking-wider font-medium">
                        {formatBillingDate(invoice.date)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-700 text-white text-[10px] font-bold border border-slate-600 uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 fill-current" />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {invoice.receiptUrl ? (
                          <a
                            href={invoice.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white transition p-1"
                            title="Download Invoice"
                          >
                            <FileDown className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">
                            Not Applicable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
            <a href="/terms" className="hover:text-white underline transition">
              Terms of Service
            </a>
            <a href="/privacy" className="hover:text-white underline transition">
              Privacy Policy
            </a>
            <a href="/cancellation-policy" className="hover:text-white underline transition">
              Cancellation Policy
            </a>
          </div>

          <div className="text-center sm:text-right font-normal normal-case text-slate-400 tracking-normal">
            Subscriptions renew automatically unless paused or terminated prior to renewal schedules.
          </div>
        </footer>

      </div>

      <BillingConfirmationModal
        isOpen={isConfirmOpen}
        modalType={modalType}
        isProcessing={isProcessingAction}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleExecuteConfirmedAction}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}