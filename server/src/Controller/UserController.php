<?php


namespace App\Controller;


use App\Entity\FriendRequest;
use App\Entity\User;
use App\Service\UserService;
use App\Utils\Response\MyJsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

/**
 * Class UserController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class UserController extends AbstractController
{

    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @Route("/admin")
     */
    public function admin(){
        return new JsonResponse("It's ok");
    }

    /**
     * @Route("/getUser", methods={"GET"})
     */
    public function getCurrentUser(){
        return new MyJsonResponse($this->userService->getCurrentUserData());
    }

    /**
     * @Route("/updateUser", methods={"PUT"})
     * @param Request $request
     * @return JsonResponse
     */
    public function updateUser(Request $request){
        $content = json_decode($request->getContent());
        $this->userService->updateCurrentUser($content->email, $content->password);
        $this->getDoctrine()->getManager()->flush();
        return new MyJsonResponse(true);
    }

    /**
     * @Route("/acceptFriendRequest", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function acceptFriendRequest(Request $request){
        $content = json_decode($request->getContent());
        $friendRequestId = $content->friendRequestId;
        /** @var FriendRequest $friendRequest */
        $friendRequest = $this->getDoctrine()->getManager()->getRepository(FriendRequest::class)->find($friendRequestId);
        $this->userService->addFriendToCurrentUser($friendRequest);
        $this->getDoctrine()->getManager()->flush();
        return new MyJsonResponse(true);

    }

    /**
     * @Route("/removeFriend", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function removeFriend(Request $request){
        $friend = $friend = $this->getFriendFromRequest($request);
        $this->userService->removeFriendFromCurrentUser($friend);
        $this->getDoctrine()->getManager()->flush();
        return new JsonResponse(true);
    }

    /**
     * @Route("/sendFriendRequest", methods={"POST"})
     * @param Request $request
     * @return MyJsonResponse
     */
    public function sendFriendRequest(Request $request){
        try {
            $content = json_decode($request->getContent());
            $friendName = $content->friendName;
            $friendRequest = $this->userService->createFriendRequest($friendName);
            $em = $this->getDoctrine()->getManager();
            $em->persist($friendRequest);
            $em->flush();
        }catch (\InvalidArgumentException $argumentException){
            return new MyJsonResponse(null, $argumentException->getMessage());
        }

        return new MyJsonResponse(true);
    }

    /**
     * @Route("/rejectFriendRequest", methods={"POST"})
     * @param Request $request
     * @return MyJsonResponse
     */
    public function rejectFriendRequest(Request $request){
        $content = json_decode($request->getContent());
        $friendRequestId = $content->friendRequestId;
        /** @var FriendRequest $friendRequest */
        $friendRequest = $this->getDoctrine()->getManager()->getRepository(FriendRequest::class)->find($friendRequestId);
        $this->userService->rejectFriendRequest($friendRequest);
        $this->getDoctrine()->getManager()->flush();
        return new MyJsonResponse(true);
    }

    /**
     * @Route("/friendList")
     */
    public function getFriendList(){
        return new MyJsonResponse($this->userService->getFriendList());
    }

    /**
     * @Route("/friendRequestList")
     */
    public function getFriendRequestList(){
        return new MyJsonResponse($this->userService->getFriendRequestList());
    }

    private function getFriendFromRequest(Request $request): User{
        $content = json_decode($request->getContent());
        $friendId = $content->friendId;
        /** @noinspection PhpIncompatibleReturnTypeInspection */
        return $this->getDoctrine()->getManager()->getRepository(User::class)->find($friendId);

    }



}