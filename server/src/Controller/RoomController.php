<?php


namespace App\Controller;


use App\Entity\Room;
use App\Entity\User;
use App\Service\PublisherService;
use App\Service\RoomService;
use App\Utils\Response\MyJsonResponse;
use App\Utils\Struct\RoomResponseStruct;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class RoomController
 * @package App\Controller
 * @IsGranted("ROLE_USER")
 */
class RoomController extends AbstractController
{
    /** @var RoomService $roomService */
    private $roomService;

    private $em;
    private $publisherService;

    public function __construct(RoomService $roomService, EntityManagerInterface $em, PublisherService $publisherService)
    {
        $this->roomService = $roomService;
        $this->em = $em;
        $this->publisherService = $publisherService;
    }

    /**
     * @Route("/roomList")
     */
    public function roomList(){
        return new MyJsonResponse($this->roomService->getRoomList());
    }

    /**
     * @Route("/createRoom")
     * @param Request $request
     * @return MyJsonResponse
     */
    public function createRoom(Request $request){
        $content = json_decode($request->getContent());
        $room = $this->roomService->createRoom($content->password, $content->name, $content->maxPeople);
        $em = $this->getDoctrine()->getManager();
        $em->persist($room);
        $em->flush();
        $roomStruct = RoomResponseStruct::mapFromRoom($room);
        $roomStruct->usersInRoom = $this->roomService->getUsersInRoom($room);
        return new MyJsonResponse($roomStruct);
    }

    /**
     * @Route("/enterRoom")
     * @param Request $request
     * @return MyJsonResponse
     */
    public function enterRoom(Request $request)
    {
        $content = json_decode($request->getContent());
        /** @var Room $room */
        $room = $this->em->getRepository(Room::class)->find($content->roomId);
        $response = $this->roomService->enterRoom($room);
        $this->publisherService->updatePeopleInRoom($room);
        return new MyJsonResponse($response);
    }

    /**
     * @Route("/room/{id}")
     * @param $id
     * @return MyJsonResponse
     */
    public function getRoomData($id){
        /** @var Room $room */
        $room = $this->getDoctrine()->getManager()->getRepository(Room::class)->find($id);
        $roomStruct = RoomResponseStruct::mapFromRoom($room);
        $roomStruct->usersInRoom = $this->roomService->getUsersInRoom($room);
        return new MyJsonResponse($roomStruct);
    }

    /**
     * @Route("/exitRoom")
     * @return MyJsonResponse
     */
    public function exitRoom(){
        $room = $this->roomService->exitRoom();
        $this->publisherService->updatePeopleInRoom($room);
        return new MyJsonResponse(true);
    }








}