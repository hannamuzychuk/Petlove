import Title from '../../components/ui/Title/Title';
import PetBlock from '../../components/ui/PetBlock/PetBlock';

export default function RegisterPage() {
  return (
    <div>
      <PetBlock
        mobile="/images/auth/mobile-registration.webp"
        mobile2x="/images/auth/mobile-registration@2x.webp"
        tablet="/images/auth/tablet-registration.webp"
        tablet2x="/images/auth/tablet-registration@2x.webp"
        desktop="/images/auth/desktop-registration.webp"
        desktop2x="/images/auth/desktop-registration@2x.webp"
        alt="Cat photo for register page"
      />
      <Title>Registration</Title>
    </div>
  );
}