<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\RoomRepository")
 * @ORM\Table(name="Rooms")
 */
class Room
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $password;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxPeople;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="room")
     */
    private $usersInRoom;

    public function __construct()
    {
        $this->usersInRoom = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }


    public function getMaxPeople(): ?int
    {
        return $this->maxPeople;
    }

    public function setMaxPeople(int $maxPeople): self
    {
        $this->maxPeople = $maxPeople;

        return $this;
    }


    /**
     * @return Collection|User[]
     */
    public function getUsersInRoom(): Collection
    {
        return $this->usersInRoom;
    }

    public function addUsersInRoom(User $usersInRoom): self
    {
        if (!$this->usersInRoom->contains($usersInRoom)) {
            $this->usersInRoom[] = $usersInRoom;
            $usersInRoom->setRoom($this);
        }

        return $this;
    }

    public function removeUsersInRoom(User $usersInRoom): self
    {
        if ($this->usersInRoom->contains($usersInRoom)) {
            $this->usersInRoom->removeElement($usersInRoom);
            // set the owning side to null (unless already changed)
            if ($usersInRoom->getRoom() === $this) {
                $usersInRoom->setRoom(null);
            }
        }

        return $this;
    }
}
