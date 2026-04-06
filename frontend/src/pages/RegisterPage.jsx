import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Heart, Droplets, ShieldCheck, Activity, AlertTriangle,
  Stethoscope, FileCheck, HandHeart, UserCheck, Eye,
  Bone, HeartPulse, Wind, CheckCircle2,
  IdCard, Users, ClipboardCheck, Lock, Salad, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch } from '../utils/api';
import {
  bloodDonationSchema,
  organPledgeSchema,
  ORGAN_OPTIONS,
  TISSUE_OPTIONS,
  BLOOD_GROUPS,
  GENDER_OPTIONS
} from '../utils/schemas';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
  out: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

/* ═══════════════════════ SHARED UI PIECES ═══════════════════════════ */

const SectionCard = ({ icon, title, subtitle, accent = "rose", children }) => {
  const borderColors = {
    rose: 'border-rose-900/30', cyan: 'border-cyan-900/30', emerald: 'border-emerald-900/30',
    amber: 'border-amber-900/30', violet: 'border-violet-900/30', slate: 'border-slate-700/50',
  };
  const iconColors = {
    rose: 'text-rose-500', cyan: 'text-cyan-400', emerald: 'text-emerald-400',
    amber: 'text-amber-400', violet: 'text-violet-400', slate: 'text-slate-400',
  };

  return (
    <div className={`bg-slate-900/50 backdrop-blur-lg p-6 md:p-8 rounded-2xl border ${borderColors[accent]} shadow-inner`}>
      <div className="mb-6">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <span className={iconColors[accent]}>{icon}</span> {title}
        </h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1.5 ml-9">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

const InputField = ({ label, helpText, error, children }) => (
  <div>
    <label className="block text-sm font-bold text-slate-300 mb-1.5">{label}</label>
    {helpText && <p className="text-xs text-slate-500 mb-2">{helpText}</p>}
    {children}
    {error && (
      <p className="text-rose-400 text-xs mt-1.5 font-semibold flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />{error}
      </p>
    )}
  </div>
);

const inputCls = (hasError) =>
  `w-full bg-slate-950/80 border ${hasError ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-700/60'} rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all text-white placeholder-slate-600 text-sm`;

const selectCls = (hasError) =>
  `w-full bg-slate-950/80 border ${hasError ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-700/60'} rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-rose-500/50 outline-none transition-all cursor-pointer text-white text-sm`;

const YesNoToggle = ({ question, helpText, value, onChange, isWarning }) => (
  <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${value ? (isWarning ? 'bg-rose-950/40 border-rose-500/30' : 'bg-emerald-950/30 border-emerald-500/30') : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700'}`}>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`mt-0.5 w-12 h-7 rounded-full flex-shrink-0 transition-all flex items-center px-1 ${value ? (isWarning ? 'bg-rose-500' : 'bg-emerald-500') : 'bg-slate-700'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-white leading-snug">{question}</p>
      {helpText && <p className="text-xs text-slate-500 mt-0.5">{helpText}</p>}
    </div>
    <span className={`text-xs font-bold uppercase tracking-wider mt-1 ${value ? (isWarning ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-600'}`}>
      {value ? 'Yes' : 'No'}
    </span>
  </div>
);

const PromiseCheckbox = ({ text, checked, onChange, error }) => (
  <div className={`p-4 rounded-xl border-2 transition-all ${checked ? 'bg-emerald-950/30 border-emerald-500/30' : error ? 'bg-rose-950/20 border-rose-500/20' : 'bg-slate-900/40 border-slate-800/40'}`}>
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-6 h-6 rounded-md border-2 border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30 focus:ring-2 cursor-pointer flex-shrink-0"
      />
      <span className="text-sm text-slate-200 leading-relaxed group-hover:text-white transition-colors font-medium">{text}</span>
    </label>
    {error && <p className="text-rose-400 text-xs mt-2 font-semibold ml-9">{error}</p>}
  </div>
);


/* ═══════════════════════ DONATE BLOOD FORM ═══════════════════════════ */

const BloodDonationForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(bloodDonationSchema),
    defaultValues: {
      hadMealLast4Hours: false, donatedLast90Days: false,
      tattooPiercingLast12Months: false, recentSurgeriesOrTransfusions: false,
      historyChronicDiseases: false, highRiskBehavior: false,
      currentlyOnMedication: false, diseaseTestingConsent: false, privacyConsent: false,
    }
  });

  const donatedRecently = watch('donatedLast90Days');

  const onSubmit = async (data) => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error("We need your location to register. Please allow GPS access.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const payload = { ...data, latitude: position.coords.latitude, longitude: position.coords.longitude };
        const response = await apiFetch('/api/registration/blood', { method: 'POST', body: JSON.stringify(payload) });
        if (!response.ok) {
          let errorMsg = "Something went wrong. Please try again.";
          try { const result = await response.json(); errorMsg = result.message || errorMsg; } catch (e) { /* ignore json parse error */ }
          throw new Error(errorMsg);
        }
        const result = await response.json();
        toast.success("You're registered! A doctor will complete the checkup. Thank you! 🎉");
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.message || "Could not connect to the server. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }, () => {
      toast.error("Location access was denied. We need your GPS to register you.");
      setLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ──── YOUR DETAILS ──── */}
      <SectionCard icon={<User className="w-5 h-5" />} title="Your Details" subtitle="Tell us a little about yourself." accent="rose">
        <div className="grid md:grid-cols-2 gap-5">
          <InputField label="Full Name" helpText="Your name as shown on your Aadhaar or ID card." error={errors.fullName?.message}>
            <input {...register('fullName')} placeholder="e.g. Ravi Kumar" className={inputCls(errors.fullName)} />
          </InputField>
          <InputField label="Date of Birth" helpText="You must be between 18 and 65 years old." error={errors.dob?.message}>
            <input {...register('dob')} type="date" max={new Date().toISOString().split('T')[0]} className={inputCls(errors.dob)} />
          </InputField>
          <InputField label="Gender" error={errors.gender?.message}>
            <select {...register('gender')} className={selectCls(errors.gender)}>
              <option value="">Choose one...</option>
              {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </InputField>
          <InputField label="Blood Group" helpText="If you don't know, select the closest one and the doctor will verify." error={errors.bloodGroup?.message}>
            <select {...register('bloodGroup')} className={selectCls(errors.bloodGroup)}>
              <option value="">Choose one...</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </InputField>
          <InputField label="Father's / Husband's Name" error={errors.guardianName?.message}>
            <input {...register('guardianName')} placeholder="Optional" className={inputCls(false)} />
          </InputField>
          <InputField label="Occupation" error={errors.occupation?.message}>
            <input {...register('occupation')} placeholder="e.g. Teacher, Student, Engineer" className={inputCls(false)} />
          </InputField>
          <div className="md:col-span-2">
            <InputField label="Full Address" error={errors.address?.message}>
              <input {...register('address')} placeholder="House number, street, city, pin code" className={inputCls(errors.address)} />
            </InputField>
          </div>
          <InputField label="Phone Number" helpText="A 10-digit Indian mobile number." error={errors.contactNumber?.message}>
            <input {...register('contactNumber')} placeholder="e.g. 9876543210" maxLength={10} className={inputCls(errors.contactNumber)} />
          </InputField>
          <InputField label="Email (not required)" error={errors.email?.message}>
            <input {...register('email')} type="email" placeholder="e.g. ravi@gmail.com" className={inputCls(errors.email)} />
          </InputField>
        </div>
      </SectionCard>

      {/* ──── SIMPLE HEALTH QUESTIONS ──── */}
      <SectionCard icon={<Stethoscope className="w-5 h-5" />} title="Simple Health Questions" subtitle="Please answer honestly. This keeps you and the patient safe." accent="amber">
        <div className="space-y-3">
          <Controller name="hadMealLast4Hours" control={control} render={({ field }) => (
            <YesNoToggle question="Did you eat something in the last 4 hours?" helpText="Please eat before donating — don't come hungry!" value={field.value} onChange={field.onChange} />
          )} />
          <Controller name="donatedLast90Days" control={control} render={({ field }) => (
            <YesNoToggle question="Did you donate blood in the last 3 months (90 days)?" helpText="Your body needs at least 90 days to recover." value={field.value} onChange={field.onChange} isWarning={field.value} />
          )} />
          <AnimatePresence>
            {donatedRecently && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-rose-950/60 border-2 border-rose-500/40 rounded-xl p-5 flex items-start gap-3"
              >
                <Heart className="w-7 h-7 text-rose-500 flex-shrink-0 animate-pulse mt-0.5" />
                <div>
                  <p className="text-rose-300 font-black text-base">Thank you for being a hero! ❤️</p>
                  <p className="text-rose-200/80 text-sm mt-1">But for your safety, you must rest for <strong>90 days</strong> before donating blood again. Please come back later — we appreciate you!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {errors.donatedLast90Days && <p className="text-rose-400 text-xs font-semibold">{errors.donatedLast90Days.message}</p>}
          <Controller name="tattooPiercingLast12Months" control={control} render={({ field }) => (
            <YesNoToggle question="Did you get a tattoo or piercing in the last 12 months?" value={field.value} onChange={field.onChange} isWarning={field.value} />
          )} />
          <Controller name="recentSurgeriesOrTransfusions" control={control} render={({ field }) => (
            <YesNoToggle question="Did you have any surgery or blood transfusion recently?" value={field.value} onChange={field.onChange} isWarning={field.value} />
          )} />
          <Controller name="historyChronicDiseases" control={control} render={({ field }) => (
            <YesNoToggle question="Do you have any long-term illness? (like heart disease, diabetes, or cancer)" value={field.value} onChange={field.onChange} isWarning={field.value} />
          )} />
          <Controller name="highRiskBehavior" control={control} render={({ field }) => (
            <YesNoToggle question="Have you been in any high-risk situations?" helpText="This is confidential. Only the doctor will see your answer." value={field.value} onChange={field.onChange} isWarning={field.value} />
          )} />
          <Controller name="currentlyOnMedication" control={control} render={({ field }) => (
            <YesNoToggle question="Are you currently taking any medicines?" value={field.value} onChange={field.onChange} />
          )} />
        </div>
      </SectionCard>

      {/* ──── FOR THE DOCTOR ONLY ──── */}
      <SectionCard icon={<Lock className="w-5 h-5" />} title="For the Doctor Only" subtitle="You don't need to fill this part — a medical professional will do it during the checkup." accent="slate">
        <div className="grid md:grid-cols-3 gap-5 opacity-35 pointer-events-none select-none">
          <InputField label="Weight (kg)"><input disabled placeholder="—" className={inputCls(false) + ' !cursor-not-allowed'} /></InputField>
          <InputField label="Blood Pressure"><input disabled placeholder="— / —" className={inputCls(false) + ' !cursor-not-allowed'} /></InputField>
          <InputField label="Heart Rate (beats/min)"><input disabled placeholder="—" className={inputCls(false) + ' !cursor-not-allowed'} /></InputField>
          <InputField label="Hemoglobin (g/dL)"><input disabled placeholder="—" className={inputCls(false) + ' !cursor-not-allowed'} /></InputField>
          <InputField label="Body Temperature (°C)"><input disabled placeholder="—" className={inputCls(false) + ' !cursor-not-allowed'} /></InputField>
        </div>
      </SectionCard>

      {/* ──── YOUR PROMISES ──── */}
      <SectionCard icon={<FileCheck className="w-5 h-5" />} title="Your Promises" subtitle="You must check both boxes to submit the form." accent="emerald">
        <div className="space-y-3">
          <Controller name="diseaseTestingConsent" control={control} render={({ field }) => (
            <PromiseCheckbox
              text="I agree to let the hospital test my blood to make sure it is safe for others."
              checked={field.value} onChange={field.onChange}
              error={errors.diseaseTestingConsent?.message}
            />
          )} />
          <Controller name="privacyConsent" control={control} render={({ field }) => (
            <PromiseCheckbox
              text="I agree to let this website store my information safely so they can contact me when someone needs blood."
              checked={field.value} onChange={field.onChange}
              error={errors.privacyConsent?.message}
            />
          )} />
        </div>
      </SectionCard>

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -2 }}
        whileTap={{ scale: 0.98 }}
        type="submit" disabled={loading || donatedRecently}
        className="w-full bg-gradient-to-r from-rose-600 to-red-700 text-white font-black text-lg py-5 rounded-2xl shadow-[0_0_25px_rgba(225,29,72,0.3)] hover:shadow-[0_0_40px_rgba(225,29,72,0.5)] flex justify-center items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <><Droplets className="w-6 h-6" /> Submit — I Want to Donate Blood 💪</>
        )}
      </motion.button>
    </form>
  );
};


/* ═══════════════════════ PLEDGE YOUR ORGANS FORM ═══════════════════════ */

const OrganPledgeForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(organPledgeSchema),
    defaultValues: {
      pledgeOrgans: [], pledgeTissues: [], pledgeAll: false,
      isWitness1Relative: false, nokConsentAcknowledgement: false,
      altruisticConsent: false, unpledgeAcknowledgement: false,
    }
  });

  const pledgeAll = watch('pledgeAll');
  const selectedOrgans = watch('pledgeOrgans');
  const selectedTissues = watch('pledgeTissues');
  const govtIdType = watch('govtIdType');

  const toggleOrgan = (organ) => {
    const current = selectedOrgans || [];
    setValue('pledgeOrgans', current.includes(organ) ? current.filter(o => o !== organ) : [...current, organ], { shouldValidate: true });
  };

  const toggleTissue = (tissue) => {
    const current = selectedTissues || [];
    setValue('pledgeTissues', current.includes(tissue) ? current.filter(t => t !== tissue) : [...current, tissue], { shouldValidate: true });
  };

  const togglePledgeAll = (val) => {
    setValue('pledgeAll', val, { shouldValidate: true });
    if (val) {
      setValue('pledgeOrgans', [...ORGAN_OPTIONS], { shouldValidate: true });
      setValue('pledgeTissues', [...TISSUE_OPTIONS], { shouldValidate: true });
    } else {
      setValue('pledgeOrgans', [], { shouldValidate: true });
      setValue('pledgeTissues', [], { shouldValidate: true });
    }
  };

  const organIcons = {
    'Heart': <Heart className="w-6 h-6" />, 'Lungs': <Wind className="w-6 h-6" />,
    'Kidneys': <Activity className="w-6 h-6" />, 'Liver': <Salad className="w-6 h-6" />,
    'Pancreas': <HeartPulse className="w-6 h-6" />, 'Intestine': <Activity className="w-6 h-6" />,
  };
  const tissueIcons = {
    'Eyes / Corneas': <Eye className="w-6 h-6" />, 'Skin': <ShieldCheck className="w-6 h-6" />,
    'Bones': <Bone className="w-6 h-6" />, 'Heart Valves': <Heart className="w-6 h-6" />,
  };

  const onSubmit = async (data) => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error("We need your location to register. Please allow GPS access.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const payload = {
          ...data,
          pledgeSelection: JSON.stringify({ organs: data.pledgeOrgans, tissues: data.pledgeTissues, all: data.pledgeAll }),
          latitude: position.coords.latitude, longitude: position.coords.longitude,
        };
        delete payload.pledgeOrgans; delete payload.pledgeTissues; delete payload.pledgeAll;
        const response = await apiFetch('/api/registration/organ', { method: 'POST', body: JSON.stringify(payload) });
        if (!response.ok) {
          let errorMsg = "Something went wrong.";
          try { const result = await response.json(); errorMsg = result.message || errorMsg; } catch (e) { /* ignore json parse error */ }
          throw new Error(errorMsg);
        }
        const result = await response.json();
        toast.success("Your organ pledge is registered! You are a hero! 🌟");
        navigate('/organ-node');
      } catch (error) {
        toast.error(error.message || "Could not connect to the server.");
      } finally { setLoading(false); }
    }, () => { toast.error("Location denied. GPS is required."); setLoading(false); });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ──── YOUR DETAILS ──── */}
      <SectionCard icon={<User className="w-5 h-5" />} title="Your Details" subtitle="Tell us a little about yourself." accent="cyan">
        <div className="grid md:grid-cols-2 gap-5">
          <InputField label="Full Name" helpText="Your name as shown on your ID card." error={errors.fullName?.message}>
            <input {...register('fullName')} placeholder="e.g. Priya Sharma" className={inputCls(errors.fullName)} />
          </InputField>
          <InputField label="Date of Birth" helpText="You must be between 18 and 65 years old." error={errors.dob?.message}>
            <input {...register('dob')} type="date" max={new Date().toISOString().split('T')[0]} className={inputCls(errors.dob)} />
          </InputField>
          <InputField label="Gender" error={errors.gender?.message}>
            <select {...register('gender')} className={selectCls(errors.gender)}>
              <option value="">Choose one...</option>
              {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </InputField>
          <InputField label="Blood Group" error={errors.bloodGroup?.message}>
            <select {...register('bloodGroup')} className={selectCls(errors.bloodGroup)}>
              <option value="">Choose one...</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </InputField>
          <InputField label="Father's / Husband's Name" error={errors.guardianName?.message}>
            <input {...register('guardianName')} placeholder="Optional" className={inputCls(false)} />
          </InputField>
          <div className="md:col-span-2">
            <InputField label="Full Address" error={errors.address?.message}>
              <input {...register('address')} placeholder="House number, street, city, pin code" className={inputCls(errors.address)} />
            </InputField>
          </div>
          <InputField label="Phone Number" helpText="A 10-digit Indian mobile number." error={errors.contactNumber?.message}>
            <input {...register('contactNumber')} placeholder="e.g. 9876543210" maxLength={10} className={inputCls(errors.contactNumber)} />
          </InputField>
          <InputField label="Email (not required)" error={errors.email?.message}>
            <input {...register('email')} type="email" placeholder="e.g. priya@gmail.com" className={inputCls(errors.email)} />
          </InputField>
        </div>
      </SectionCard>

      {/* ──── YOUR ID CARD ──── */}
      <SectionCard icon={<IdCard className="w-5 h-5" />} title="Your ID Card" subtitle="We need one government ID to verify you." accent="violet">
        <div className="grid md:grid-cols-2 gap-5">
          <InputField label="Type of ID" error={errors.govtIdType?.message}>
            <select {...register('govtIdType')} className={selectCls(errors.govtIdType)}>
              <option value="">Choose one...</option>
              <option value="Aadhaar">Aadhaar Card (12-digit number)</option>
              <option value="VoterID">Voter ID Card (e.g. ABC1234567)</option>
            </select>
          </InputField>
          <InputField
            label="ID Number" error={errors.govtIdNumber?.message}
            helpText={govtIdType === 'Aadhaar' ? 'Enter all 12 digits without spaces.' : govtIdType === 'VoterID' ? 'Enter 3 letters followed by 7 numbers.' : 'Select your ID type first.'}
          >
            <input {...register('govtIdNumber')}
              placeholder={govtIdType === 'Aadhaar' ? '123456789012' : govtIdType === 'VoterID' ? 'ABC1234567' : '—'}
              maxLength={govtIdType === 'Aadhaar' ? 12 : 10} className={inputCls(errors.govtIdNumber)}
            />
          </InputField>
        </div>
      </SectionCard>

      {/* ──── WHAT DO YOU WANT TO DONATE? ──── */}
      <SectionCard icon={<HandHeart className="w-5 h-5" />} title="What Do You Want to Donate?" subtitle="Pick the parts of your body you'd like to donate after you pass away. Every choice saves a life." accent="cyan">
        <motion.button type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={() => togglePledgeAll(!pledgeAll)}
          className={`w-full mb-6 p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${pledgeAll ? 'bg-gradient-to-r from-cyan-950/60 to-teal-950/60 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
        >
          <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${pledgeAll ? 'bg-cyan-500 border-cyan-400' : 'border-slate-600'}`}>
            {pledgeAll && <CheckCircle2 className="w-5 h-5 text-white" />}
          </div>
          <div className="text-left">
            <p className="text-white font-black text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Donate Everything
            </p>
            <p className="text-sm text-slate-400 mt-0.5">I want to donate all my organs and tissues to save as many lives as possible.</p>
          </div>
        </motion.button>

        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Organs</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {ORGAN_OPTIONS.map(organ => {
            const isSelected = (selectedOrgans || []).includes(organ);
            return (
              <button type="button" key={organ} onClick={() => toggleOrgan(organ)}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${isSelected ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'}`}
              >
                {organIcons[organ] || <Heart className="w-6 h-6" />}
                <span className="font-bold text-sm">{organ}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Tissues</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TISSUE_OPTIONS.map(tissue => {
            const isSelected = (selectedTissues || []).includes(tissue);
            return (
              <button type="button" key={tissue} onClick={() => toggleTissue(tissue)}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${isSelected ? 'bg-teal-950/40 border-teal-500/40 text-teal-300' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'}`}
              >
                {tissueIcons[tissue] || <ShieldCheck className="w-6 h-6" />}
                <span className="font-bold text-sm">{tissue}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-400 ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.pledgeOrgans && <p className="text-rose-400 text-xs mt-3 font-semibold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />{errors.pledgeOrgans.message}</p>}
      </SectionCard>

      {/* ──── CLOSEST FAMILY MEMBER ──── */}
      <SectionCard icon={<Users className="w-5 h-5" />} title="Closest Family Member" subtitle="Please tell us who to contact in your family. After you pass away, they will give the final permission." accent="amber">
        <div className="bg-amber-950/30 border border-amber-900/30 rounded-lg p-3 mb-5">
          <p className="text-xs text-amber-400/80 font-semibold">⚠️ This is very important. After you pass away, the hospital will ask this person if they agree to the donation.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <InputField label="Their Full Name" error={errors.nokName?.message}>
            <input {...register('nokName')} placeholder="e.g. Sunita Sharma" className={inputCls(errors.nokName)} />
          </InputField>
          <InputField label="How Are They Related to You?" error={errors.nokRelationship?.message}>
            <select {...register('nokRelationship')} className={selectCls(errors.nokRelationship)}>
              <option value="">Choose one...</option>
              {['Wife', 'Husband', 'Mother', 'Father', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </InputField>
          <InputField label="Their Phone Number" error={errors.nokContact?.message}>
            <input {...register('nokContact')} placeholder="e.g. 9876543210" maxLength={10} className={inputCls(errors.nokContact)} />
          </InputField>
          <InputField label="Their Address (not required)" error={errors.nokAddress?.message}>
            <input {...register('nokAddress')} placeholder="Optional" className={inputCls(false)} />
          </InputField>
        </div>
      </SectionCard>

      {/* ──── WITNESSES ──── */}
      <SectionCard icon={<UserCheck className="w-5 h-5" />} title="Witnesses" subtitle="Two people who saw you sign this form. They can be friends, neighbors, or anyone you trust." accent="violet">
        <div className="grid md:grid-cols-2 gap-5 mb-4">
          <InputField label="Witness 1 — Full Name" error={errors.witness1Name?.message}>
            <input {...register('witness1Name')} placeholder="e.g. Amit Patel" className={inputCls(errors.witness1Name)} />
          </InputField>
          <InputField label="Witness 1 — Signature ID (not required)">
            <input {...register('witness1SignatureRef')} placeholder="Optional" className={inputCls(false)} />
          </InputField>
          <InputField label="Witness 2 — Full Name" error={errors.witness2Name?.message}>
            <input {...register('witness2Name')} placeholder="e.g. Meena Joshi" className={inputCls(errors.witness2Name)} />
          </InputField>
          <InputField label="Witness 2 — Signature ID (not required)">
            <input {...register('witness2SignatureRef')} placeholder="Optional" className={inputCls(false)} />
          </InputField>
        </div>
        <Controller name="isWitness1Relative" control={control} render={({ field }) => (
          <YesNoToggle question="Is Witness 1 a member of your family?" value={field.value} onChange={field.onChange} />
        )} />
      </SectionCard>

      {/* ──── YOUR PROMISES ──── */}
      <SectionCard icon={<ClipboardCheck className="w-5 h-5" />} title="Your Promises" subtitle="Please read carefully and check all three boxes. You cannot submit without agreeing." accent="emerald">
        <div className="space-y-3">
          <Controller name="nokConsentAcknowledgement" control={control} render={({ field }) => (
            <PromiseCheckbox
              text="I know this is just a wish. After I pass away, my family must give final permission."
              checked={field.value} onChange={field.onChange}
              error={errors.nokConsentAcknowledgement?.message}
            />
          )} />
          <Controller name="altruisticConsent" control={control} render={({ field }) => (
            <PromiseCheckbox
              text="I know selling organs is illegal. I am doing this freely to save lives."
              checked={field.value} onChange={field.onChange}
              error={errors.altruisticConsent?.message}
            />
          )} />
          <Controller name="unpledgeAcknowledgement" control={control} render={({ field }) => (
            <PromiseCheckbox
              text="I know I can cancel this form at any time if I change my mind."
              checked={field.value} onChange={field.onChange}
              error={errors.unpledgeAcknowledgement?.message}
            />
          )} />
        </div>
      </SectionCard>

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -2 }}
        whileTap={{ scale: 0.98 }}
        type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black text-lg py-5 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] flex justify-center items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <><HandHeart className="w-6 h-6" /> Submit — I Want to Save Lives 🌟</>
        )}
      </motion.button>
    </form>
  );
};


/* ═══════════════════════ MAIN PAGE ═══════════════════════════ */

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState('blood');

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="py-10 md:py-20 min-h-[85vh] px-4 md:px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-rose-400 tracking-widest uppercase">Safe & Secure Registration</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Become a <span className="bg-gradient-to-r from-rose-500 to-cyan-400 bg-clip-text text-transparent">Lifesaver</span>
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-base md:text-lg">
            Register to donate blood or pledge your organs. It's free, safe, and your information is kept private.
          </p>
        </div>

        <div className="flex bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1.5 mb-8 border border-slate-800">
          <button
            onClick={() => setActiveTab('blood')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'blood' ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-900/30' : 'text-slate-400 hover:text-white'}`}
          >
            <Droplets className="w-5 h-5" />
            <span className="hidden sm:inline">🩸 Donate Blood</span>
            <span className="sm:hidden">🩸 Blood</span>
          </button>
          <button
            onClick={() => setActiveTab('organ')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'organ' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-900/30' : 'text-slate-400 hover:text-white'}`}
          >
            <HandHeart className="w-5 h-5" />
            <span className="hidden sm:inline">🫀 Pledge Your Organs</span>
            <span className="sm:hidden">🫀 Organs</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'blood' ? (
            <motion.div key="blood" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <BloodDonationForm />
            </motion.div>
          ) : (
            <motion.div key="organ" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <OrganPledgeForm />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Your data is encrypted and safe</p>
          </div>
          <p className="text-[11px] text-slate-600 max-w-lg mx-auto leading-relaxed">
            This form follows the rules of NBTC (for blood donation) and NOTTO Form-7 (for organ pledging) — official guidelines of the Government of India.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
