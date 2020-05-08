<?php


namespace App\Service;


use App\Entity\FriendRequest;
use App\Entity\User;
use App\Utils\Struct\FriendRequestResponseStruct;
use App\Utils\Struct\FriendResponseStruct;
use App\Utils\Struct\UserResponseStruct;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Exception\MissingMandatoryParametersException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;

class UserService
{

    private $passwordEncoder;
    private $security;
    private $em;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder, Security $security, EntityManagerInterface $em)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->security= $security;
        $this->em = $em;
    }

    public function registerUser($username, $email, $password){
        $user = new User();

        if (empty($username) || empty($email) || empty($password)){
            throw new MissingMandatoryParametersException('Nie zostały podane wszystkie parametry');
        }
        $user->setUsername($username)
            ->setEmail($email)
            ->setPassword($this->passwordEncoder->encodePassword($user, $password))
            ->addRole(User::ROLE_USER);
        return $user;
    }

    /**
     * @return UserResponseStruct
     */
    public function getCurrentUserData(){
        /** @var User $user */
        $user = $this->security->getUser();
        return UserResponseStruct::mapFromUser($user);
    }

    /**
     * @param $email
     * @param $password
     */
    public function updateCurrentUser($email, $password){
        /** @var User $user */
        $user = $this->security->getUser();

        if(!empty($email)){
            $user->setEmail($email);
        }
        if (!empty($password)){
            $user->setPassword($this->passwordEncoder->encodePassword($user, $password));
        }
    }

    public function addFriendToCurrentUser(FriendRequest $friendRequest){
        $friend = $friendRequest->getFriend();
        $this->em->remove($friendRequest);
        /** @var User $user */
        $user = $this->security->getUser();
        $user->addMyFriend($friend);
        $friend->addMyFriend($user);
    }

    public function removeFriendFromCurrentUser(User $friend){
        /** @var User $user */
        $user = $this->security->getUser();
        $user->removeMyFriend($friend);
        $friend->removeMyFriend($user);
    }

    /**
     * @param string $friendName
     * @return FriendRequest
     */
    public function createFriendRequest(string $friendName)
    {

        /** @var User $friend */
        $friend = $this->em->getRepository(User::class)->findOneBy(['username' => $friendName]);
        /** @var User $user */
        $user = $this->security->getUser();
        if($friend->getId()==$user->getId()){
            throw new \InvalidArgumentException("Nie możesz wysłać zaproszenia do samego siebie");
        }
        $friendRequest = new FriendRequest();
        $friendRequest->setUser($user);
        $friendRequest->setFriend($friend);
        $friendRequest->setDate(new \DateTime());
        return $friendRequest;


    }


    public function rejectFriendRequest(FriendRequest $friendRequest)
    {
        $this->em->remove($friendRequest);
    }

    public function getFriendList(){
        /** @var User $user */
        $user = $this->security->getUser();
        $friendList = $user->getMyFriends();
        $responseList = [];
        foreach ($friendList as $friend){
            $responseList[] = FriendResponseStruct::mapFromFriend($friend);
        }
        return $responseList;
    }

    public function getFriendRequestList(){
        /** @var User $user */
        $user = $this->security->getUser();
        $requests = $user->getFriendRequests();
        $responseList = [];
        foreach ($requests as $request){
            $responseList[] = FriendRequestResponseStruct::mapFromFriendRequest($request);
        }
        return $responseList;

    }


    private function getFriendFromRequest(Request $request): User{
        $content = json_decode($request->getContent());
        $friendId = $content->friendId;
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->em->getRepository(User::class)->find($friendId);

    }

}