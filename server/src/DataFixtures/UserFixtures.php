<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $user = new User();
        $user->setUsername('Maciek');
        $user->setPassword($this->passwordEncoder->encodePassword($user, '123'));
        $user->addRole(User::ROLE_USER);
        $manager->persist($user);

        $user = new User();
        $user->setUsername('Michał');
        $user->setPassword($this->passwordEncoder->encodePassword($user, '12345'));
        $user->addRole(User::ROLE_USER);
        $manager->persist($user);

        $manager->flush();
    }


}
