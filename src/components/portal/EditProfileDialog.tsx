import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UserCheck, ShieldCheck } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: { id: string; name: string }[];
  onProfileUpdated?: () => void;
}

const BOARDS = ['CBSE', 'ICSE', 'MP Board', 'State Board', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  classes,
  onProfileUpdated,
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [classId, setClassId] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [schoolName, setSchoolName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Madhya Pradesh');
  const [pincode, setPincode] = useState('');

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prepopulate with existing saved profile values
  useEffect(() => {
    if (profile && open) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setParentPhone(profile.parent_phone || '');
      setParentName(profile.parent_name || '');
      setClassId(profile.class_id || '');
      setBoard(profile.board || 'CBSE');
      setSchoolName(profile.school_name || '');
      setDateOfBirth(profile.date_of_birth || '');
      setGender(profile.gender || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || 'Madhya Pradesh');
      setPincode(profile.pincode || '');
      setErrors({});
    }
  }, [profile, open]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

    if (phone.trim()) {
      const cleaned = phone.replace(/[^0-9]/g, '');
      if (cleaned.length < 10 || cleaned.length > 11) {
        errs.phone = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (parentPhone.trim()) {
      const cleaned = parentPhone.replace(/[^0-9]/g, '');
      if (cleaned.length < 10 || cleaned.length > 11) {
        errs.parentPhone = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (pincode.trim() && !/^\d{6}$/.test(pincode.trim())) {
      errs.pincode = 'Pincode must be 6 digits';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validate()) {
      toast({
        title: 'Validation Error',
        description: 'Please correct the highlighted fields before saving.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        parent_phone: parentPhone.trim() || null,
        parent_name: parentName.trim() || null,
        class_id: classId ? classId : null,
        board: board.trim() || 'CBSE',
        school_name: schoolName.trim() || null,
        date_of_birth: dateOfBirth || null,
        gender: gender || null,
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || 'Madhya Pradesh',
        pincode: pincode.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile Updated Successfully! 🎉',
        description: 'Your changes have been saved to your student account.',
      });

      onProfileUpdated?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Update Failed',
        description:
          err instanceof Error
            ? err.message
            : 'Could not update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <DialogTitle className="text-xl font-bold">Edit Student Profile</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Update your personal and academic details. Your information is securely stored and used for test registrations and receipts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 py-2">
          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-name" className="text-xs">
                  Full Name *
                </Label>
                <Input
                  id="edit-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="h-9 text-xs mt-1"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-destructive mt-0.5">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-email" className="text-xs">
                  Email Address
                </Label>
                <Input
                  id="edit-email"
                  value={user?.email || ''}
                  disabled
                  className="h-9 text-xs mt-1 bg-muted/50 cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground mt-0.5">Email cannot be changed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-phone" className="text-xs">
                  Student Mobile Number
                </Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={15}
                  className="h-9 text-xs mt-1"
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive mt-0.5">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-gender" className="text-xs">
                  Gender
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="edit-gender" className="h-9 text-xs mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-dob" className="text-xs">
                Date of Birth
              </Label>
              <Input
                id="edit-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-9 text-xs mt-1"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Academic Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-class" className="text-xs">
                  Class / Academic Course
                </Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger id="edit-class" className="h-9 text-xs mt-1">
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-board" className="text-xs">
                  Education Board
                </Label>
                <Select value={board} onValueChange={setBoard}>
                  <SelectTrigger id="edit-board" className="h-9 text-xs mt-1">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOARDS.map((b) => (
                      <SelectItem key={b} value={b} className="text-xs">
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-school" className="text-xs">
                School / College Name
              </Label>
              <Input
                id="edit-school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g. St. Joseph's Co-ed School, Bhopal"
                className="h-9 text-xs mt-1"
              />
            </div>
          </div>

          {/* Parent Info */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Parent / Guardian Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-parent-name" className="text-xs">
                  Parent / Guardian Name
                </Label>
                <Input
                  id="edit-parent-name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Father / Mother / Guardian"
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-parent-phone" className="text-xs">
                  Parent Phone Number
                </Label>
                <Input
                  id="edit-parent-phone"
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={15}
                  className="h-9 text-xs mt-1"
                />
                {errors.parentPhone && (
                  <p className="text-[11px] text-destructive mt-0.5">{errors.parentPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">
              Location & Address
            </h4>
            <div>
              <Label htmlFor="edit-address" className="text-xs">
                Residential Address
              </Label>
              <Input
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Flat, Street, Area"
                className="h-9 text-xs mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="edit-city" className="text-xs">
                  City
                </Label>
                <Input
                  id="edit-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bhopal"
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-state" className="text-xs">
                  State
                </Label>
                <Input
                  id="edit-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Madhya Pradesh"
                  className="h-9 text-xs mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-pincode" className="text-xs">
                  Pincode
                </Label>
                <Input
                  id="edit-pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="462001"
                  maxLength={6}
                  className="h-9 text-xs mt-1"
                />
                {errors.pincode && (
                  <p className="text-[11px] text-destructive mt-0.5">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

