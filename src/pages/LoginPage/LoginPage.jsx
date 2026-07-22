import Title from '../../components/ui/Title/Title';
import PetBlock from '../../components/ui/PetBlock/PetBlock';

export default function LoginPage() {
  return (
    <div>
      <PetBlock
        mobile="/images/auth/mobile_login.webp"
        mobile2x="/images/auth/mobile_login@2x.webp"
        tablet="/images/auth/tablet-login.webp"
        tablet2x="/images/auth/tablet-login@2x.webp"
        desktop="/images/auth/desktop-login.webp"
        desktop2x="/images/auth/desktop-login@2x.webp"
        alt="Dog photo for login page"
        />
      <Title>Log in</Title>
    </div>
  );
}